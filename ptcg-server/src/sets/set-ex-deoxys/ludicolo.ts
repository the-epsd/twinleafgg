import { PokemonCard, Stage, CardType, StoreLike, State, GameError, GameMessage, PowerType, PlayerType, StateUtils, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { IS_POKEPOWER_BLOCKED, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Ludicolo extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Lombre';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public powers = [{
    name: 'Swing Dance',
    powerType: PowerType.POKEPOWER,
    useWhileInPlay: true,
    text: 'Once during your turn (before your attack), you may draw a card. This power can\'t be used if Ludicolo is affected by a Special Condition.'
  }];

  public attacks = [
    {
      name: 'Water Healing Steps',
      cost: [W],
      damage: 30,
      text: 'You may discard as many cards as you like from your hand. If you do, remove that many damage counters from Ludicolo.'
    },
    {
      name: 'Circular Steps',
      cost: [W, C, C],
      damage: 10,
      damageCalculation: '+',
      text: 'Does 10 damage times the number of Pokémon in play (both yours and your opponent\'s), excluding Ludicolo.'
    }
  ];

  public set: string = 'DX';
  public setNumber: string = '10';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ludicolo';
  public fullName: string = 'Ludicolo DX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle Swing Dance Poké-Power
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (!IS_POKEPOWER_BLOCKED) {
        // Check if Ludicolo is affected by a Special Condition
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            if (cardList.specialConditions.length > 0) {
              throw new GameError(GameMessage.CANNOT_USE_POWER);
            }
          }
        });
        // Draw a card
        player.deck.moveTo(player.hand, 1);
      }
    }

    // Handle Water Healing Steps attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const active = player.active;

      if (!active) {
        return state;
      }

      // Allow player to discard any number of cards
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { min: 0, max: player.hand.cards.length, allowCancel: true }
      ), transfers => {
        if (!transfers || transfers.length === 0) {
          return state;
        }

        // Remove damage counters equal to number of cards discarded
        const damageToRemove = transfers.length * 10;
        active.damage = Math.max(0, active.damage - damageToRemove);

        // Discard the cards
        for (const transfer of transfers) {
          MOVE_CARDS(store, state, player.hand, player.discard, { cards: [transfer] });
        }

        return state;
      });
    }

    // Handle Circular Steps attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Count all Pokémon in play except Ludicolo
      let pokemonCount = 0;

      // Count opponent's Pokémon
      if (opponent.active) pokemonCount++;
      pokemonCount += opponent.bench.filter(b => b.cards.length > 0).length;

      // Count player's Pokémon
      if (player.active && player.active !== effect.source) pokemonCount++;
      pokemonCount += player.bench.filter(b => b.cards.length > 0).length;

      effect.damage = pokemonCount * 10;
    }
    return state;
  }
} 