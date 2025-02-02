import { PokemonCard, Stage, CardType, ChooseCardsPrompt, GameError, GameMessage, ShowCardsPrompt, State, StateUtils, StoreLike, SuperType, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Nidorina extends PokemonCard {
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Nidoran F';
  public cardType = CardType.DARK;
  public hp = 90;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Fetch Family',
      cost: [CardType.DARK],
      damage: 0,
      text: 'Search your deck for up to 3 Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Sharp Fang',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'MEW';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Nidorina';
  public fullName: string = 'Nidorina MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 0, max: 3, allowCancel: false }
      ), selected => {
        const cards = selected || [];

        if (cards.length > 0) {
          store.prompt(state, [new ShowCardsPrompt(
            opponent.id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            cards
          )], () => {
            player.deck.moveCardsTo(cards, player.hand);
          });
        }

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });

      });
    }
    return state;
  }
}