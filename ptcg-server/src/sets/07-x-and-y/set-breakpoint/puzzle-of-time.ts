import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, CardList, OrderCardsPrompt, SelectOptionPrompt } from '../../../game';
import { MOVE_CARDS, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class PuzzleOfTime extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';
  public name: string = 'Puzzle of Time';
  public fullName: string = 'Puzzle of Time BKP';
  public text: string =
    'You may play 2 Puzzle of Time cards at once.\n\n' +
    '• If you played 1 card, look at the top 3 cards of your deck and put them back in any order.\n' +
    '• If you played 2 cards, put 2 cards from your discard pile into your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    // This card is still in hand here, so 2 copies in hand means this one plus a second
    const puzzlesInHand = player.hand.cards.filter((c) => c.name === 'Puzzle of Time').length;
    return player.deck.cards.length > 0 || puzzlesInHand >= 2;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (
        player.deck.cards.length === 0 &&
        player.hand.cards.filter((c) => c.name === 'Puzzle of Time').length < 2
      ) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      state = store.prompt(
        state,
        new SelectOptionPrompt(
          player.id,
          GameMessage.CHOOSE_OPTION,
          [
            'play 1 card, look at the top 3 cards of your deck and put them back in any order.',
            'play 2 cards, put 2 cards from your discard pile into your hand.',
          ],
          {
            allowCancel: false,
            defaultValue: 0,
          },
        ),
        (choice) => {
          if (choice === 0) {
            if (player.deck.cards.length === 0) {
              throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
            }

            const deckTop = new CardList();
            MOVE_CARDS(store, state, player.deck, deckTop, { count: 3, sourceCard: this });

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
          } else if (choice === 1) {
            if (player.discard.cards.length === 0) {
              throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
            }

            const secondPuzzle = player.hand.cards.find((c) => c.name === 'Puzzle of Time');
            if (secondPuzzle === undefined) {
              throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
            }

            const mincards = Math.min(player.discard.cards.length, 2);

            SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
              store,
              state,
              player,
              this,
              {},
              { min: mincards, max: mincards, allowCancel: false },
              effect,
            );

            MOVE_CARDS(store, state, player.hand, player.discard, {
              cards: [secondPuzzle],
              sourceCard: this,
            });
          }
        },
      );
    }

    return state;
  }
}
