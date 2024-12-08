import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, PlayerType, SlotType, MoveEnergyPrompt, ConfirmPrompt, Card, PokemonCardList,/* GameError,*/ EnergyCard, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { CardTarget } from '../../game';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';

// LOT Articuno-GX 132 (https://limitlesstcg.com/cards/LOT/132)
export class ArticunoGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 170;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Legendary Ascent',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may switch it with your Active Pokémon. If you do, move any number of [W] Energy from your other Pokémon to this Pokémon. '
  }];
  public attacks = [
    {
      name: 'Ice Wing',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 130,
      text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },

    {
      name: 'Cold Crush-GX',
      cost: [CardType.WATER],
      damage: 0,
      gxAttack: true,
      text: 'Discard all Energy from both Active Pokémon. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'CES';

  public setNumber: string = '31';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Articuno-GX';

  public fullName: string = 'Articuno-GX CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mysterious Guidance
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          let bench: PokemonCardList | undefined;
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            if (card === this && target.slot === SlotType.BENCH) {
              bench = cardList;
            }
          });
          if (bench) {
            player.switchPokemon(bench);
          }

          const blockedFrom: CardTarget[] = [];
          const blockedTo: CardTarget[] = [];

          let hasEnergyOnBench = false;
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            if (cardList === player.active) {
              blockedFrom.push(target);
              return;
            }
            blockedTo.push(target);
            if (cardList.cards.some(c => c instanceof EnergyCard)) {
              hasEnergyOnBench = true;
            }
          });

          if (hasEnergyOnBench === false) {
            return state;
          }

          return store.prompt(state, new MoveEnergyPrompt(
            effect.player.id,
            GameMessage.MOVE_ENERGY_TO_ACTIVE,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { superType: SuperType.ENERGY },
            { min: 1, allowCancel: false, blockedFrom, blockedTo }
          ), result => {
            const transfers = result || [];
            transfers.forEach(transfer => {
              const source = StateUtils.getTarget(state, player, transfer.from);
              const target = StateUtils.getTarget(state, player, transfer.to);
              source.moveCardTo(transfer.card, target);
            });
          });
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      const opponentEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
      state = store.reduceEffect(state, checkProvidedEnergy);
      state = store.reduceEffect(state, opponentEnergy);


      const cards: Card[] = [];
      const oppCards: Card[] = [];
      checkProvidedEnergy.energyMap.forEach(em => {
        cards.push(em.card);
      });
      opponentEnergy.energyMap.forEach(em => {
        oppCards.push(em.card);
      });

      const discardEnergy2 = new DiscardCardsEffect(effect, oppCards);
      discardEnergy2.target = opponent.active;
      store.reduceEffect(state, discardEnergy2);

      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);
    }
    return state;
  }
} 