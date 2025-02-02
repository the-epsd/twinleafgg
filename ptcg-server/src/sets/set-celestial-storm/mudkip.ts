import { CardType, ChooseCardsPrompt, EnergyType, GameLog, GameMessage, PokemonCard, ShowCardsPrompt, Stage, State, StateUtils, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Mudkip extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType = CardType.WATER;

  public hp = 60;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Water Reserve',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Search your deck for up to 3 [W] Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.'
    }
  ];

  public set: string = 'CES';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '32';

  public name: string = 'Mudkip';

  public fullName: string = 'Mudkip CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { min: 0, max: 3, allowCancel: false }
      ), cards => {
        cards = cards || [];

        if (cards.length > 0) {
          player.deck.moveCardsTo(cards, player.hand);

          cards.forEach((card, index) => {
            store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
          });

          if (cards.length > 0) {
            state = store.prompt(state, new ShowCardsPrompt(
              opponent.id,
              GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
              cards), () => state);
          }
        }
      });
    }
    return state;
  }
}