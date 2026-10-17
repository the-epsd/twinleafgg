import {
  CardList,
  GameError,
  GameMessage,
  OrderCardsPrompt,
  Player,
  State,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Pokedex extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '98';
  public name: string = 'Pokédex';
  public fullName: string = 'Pokedex BLW';
  public text: string =
    'Look at the top 5 cards of your deck and put them back on top of your deck in any order.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      const deckTop = new CardList();
      const count = Math.min(5, player.deck.cards.length);
      MOVE_CARDS(store, state, player.deck, deckTop, { count, sourceCard: this });

      SHOW_CARDS_TO_PLAYER(store, state, player, deckTop.cards);

      return store.prompt(
        state,
        new OrderCardsPrompt(player.id, GameMessage.CHOOSE_CARDS_ORDER, deckTop, {
          allowCancel: false,
        }),
        (order) => {
          if (order === null) {
            return state;
          }

          deckTop.applyOrder(order);
          deckTop.moveToTopOfDestination(player.deck);
        },
      );
    }

    return state;
  }
}
