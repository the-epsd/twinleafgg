import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerToDeckEffect } from '../../../game/store/effects/play-card-effects';
import {
  StateUtils,
  GameError,
  GameMessage,
  ChooseCardsPrompt,
  Card,
  CardList,
  OrderCardsPrompt,
  Player,
} from '../../../game';
import {
  MOVE_CARDS,
  MULTIPLE_COIN_FLIPS_PROMPT,
  SHOW_CARDS_TO_PLAYER,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { MoveCardsEffect } from '../../../game/store/effects/game-effects';

export class Cyllene extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '138';
  public name: string = 'Cyllene';
  public fullName: string = 'Cyllene ASR';
  public text: string =
    'Flip 2 coins. Put a number of cards up to the number of heads from your discard pile on top of your deck in any order.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
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
      const opponent = StateUtils.getOpponent(state, player);

      let cards: Card[] = [];

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [effect.trainerCard], sourceCard: this });
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      let heads: number = 0;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, (results) => {
        results.forEach((r) => {
          heads += r ? 1 : 0;
        });

        if (heads === 0) {
          return state;
        }

        const deckTop = new CardList();

        store.prompt(
          state,
          new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK,
            player.discard,
            {},
            { min: Math.min(heads, player.discard.cards.length), max: heads, allowCancel: false },
          ),
          (selected) => {
            cards = selected || [];

            const trainerCards = cards.filter((card) => card instanceof TrainerCard);
            const nonTrainerCards = cards.filter((card) => !(card instanceof TrainerCard));

            let canMoveTrainerCards = true;
            if (trainerCards.length > 0) {
              const discardEffect = new TrainerToDeckEffect(player, this);
              store.reduceEffect(state, discardEffect);
              canMoveTrainerCards = !discardEffect.preventDefault;
            }

            const cardsToMove = canMoveTrainerCards ? cards : nonTrainerCards;

            if (cardsToMove.length > 0) {
              cardsToMove.forEach((card) => {
                let canMoveCard = true;
                try {
                  store.reduceEffect(
                    state,
                    new MoveCardsEffect(player.discard, player.deck, { cards: [card] }),
                  );
                } catch {
                  canMoveCard = false;
                }

                if (canMoveCard) {
                  MOVE_CARDS(store, state, player.discard, deckTop, {
                    cards: [card],
                    sourceCard: this,
                  });
                }
              });

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

                  return SHOW_CARDS_TO_PLAYER(store, state, opponent, cardsToMove);
                },
              );
            }

            return state;
          },
        );
      });
    }
    return state;
  }
}
