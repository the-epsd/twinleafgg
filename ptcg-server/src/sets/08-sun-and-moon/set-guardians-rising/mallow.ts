import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { CardList } from '../../../game/store/state/card-list';
import {
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  OrderCardsPrompt,
  Player,
  State,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Mallow extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'GRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '127';
  public name: string = 'Mallow';
  public fullName: string = 'Mallow GRI';
  public text: string =
    'Search your deck for 2 cards, shuffle your deck, then put those cards on top of it in any order.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const deckTop = new CardList();

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.deck,
          {},
          { min: 2, max: 2, allowCancel: false },
        ),
        (selected) => {
          const cards = selected || [];
          MOVE_CARDS(store, state, player.deck, deckTop, { cards, sourceCard: this });

          // Shuffle the deck, then order the chosen cards and put them on top
          SHUFFLE_DECK(store, state, player);
          store.waitPrompt(state, () => {
            store.prompt(
              state,
              new OrderCardsPrompt(player.id, GameMessage.CHOOSE_CARDS_ORDER, deckTop, {
                allowCancel: false,
              }),
              (order) => {
                if (order === null) {
                  return;
                }
                deckTop.applyOrder(order);
                deckTop.moveToTopOfDestination(player.deck);
              },
            );
          });
        },
      );
    }

    return state;
  }
}
