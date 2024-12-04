import { PokemonCard, Stage, CardType, StoreLike, State, PowerType, ChooseCardsPrompt, GameMessage, ShowCardsPrompt, StateUtils, SuperType, GameError, PlayerType, ShuffleDeckPrompt, BoardEffect } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class FanRotom extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 70;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Fan Call',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your first turn, you may search your deck for up to 3 [C] Pokémon with 100 HP or less, reveal them, and put them into your hand. Then, shuffle your deck. You can\'t use more than 1 Fan Call Ability during your turn.'
  }];

  public attacks = [
    {
      name: 'Assault Landing',
      cost: [CardType.COLORLESS],
      damage: 70,
      text: 'If there is no Stadium in play, this attack does nothing.'
    }
  ];

  public regulationMark = 'H';

  public set: string = 'SCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '118';

  public name: string = 'Fan Rotom';

  public fullName: string = 'Fan Rotom SV7';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.usedFanCall = false;
      return state;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.usedFanCall == true) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (state.turn > 2) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      } else {

        let pokemons = 0;

        const blocked: number[] = [];
        player.deck.cards.forEach((c, index) => {
          if (c instanceof PokemonCard && c.cardType === CardType.COLORLESS && c.hp <= 100) {
            pokemons += 1;
          } else {
            blocked.push(index);
          }
        });

        const maxPokemons = Math.min(pokemons, 3);

        state = store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.deck,
          { superType: SuperType.POKEMON },
          { min: 0, max: 3, allowCancel: false, blocked, maxPokemons }
        ), selected => {
          const cards = selected || [];

          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              cardList.addBoardEffect(BoardEffect.ABILITY_USED);
            }
          });

          if (cards.length > 0) {
            store.prompt(state, [new ShowCardsPrompt(
              opponent.id,
              GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
              cards
            )], () => {

              player.deck.moveCardsTo(cards, player.hand);
              player.usedFanCall = true;
            });
          }
          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
        });
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard == undefined) {
        effect.damage = 0;
      } else {
        effect.damage = 70;
      }
    }
    return state;
  }
}