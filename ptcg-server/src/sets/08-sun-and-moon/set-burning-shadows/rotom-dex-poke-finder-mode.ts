import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import {
  CardList,
  ConfirmPrompt,
  GameMessage,
  OrderCardsPrompt,
  Player,
  StoreLike,
  State,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class RotomDexPokeFinderMode extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '122';
  public name: string = 'Rotom Dex Poké Finder Mode';
  public fullName: string = 'Rotom Dex Poké Finder Mode BUS';
  public text: string =
    'Look at the top 4 cards of your deck and put them back in any order or shuffle them into your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      const deckTop = new CardList();
      MOVE_CARDS(store, state, player.deck, deckTop, {
        count: Math.min(4, player.deck.cards.length),
        sourceCard: this,
      });

      // Ask: put back in order or shuffle into deck?
      return store.prompt(
        state,
        new ConfirmPrompt(player.id, GameMessage.ORDER_YOUR_DECK),
        (wantToOrder) => {
          if (wantToOrder) {
            // Put them back in any order
            store.prompt(
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
          } else {
            // Shuffle into deck
            MOVE_CARDS(store, state, deckTop, player.deck, { sourceCard: this });
            SHUFFLE_DECK(store, state, player);
          }
        },
      );
    }

    return state;
  }
}
