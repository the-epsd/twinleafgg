import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect, TrainerToDeckEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils, GameError, GameMessage, CoinFlipPrompt, ChooseCardsPrompt, Card, CardList, OrderCardsPrompt, ShowCardsPrompt } from '../../game';

export class Cyllene extends TrainerCard {

  public regulationMark = 'F';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'ASR';

  public setNumber: string = '138';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Cyllene';

  public fullName: string = 'Cyllene ASR';

  public text: string =
    'Flip 2 coins. Put a number of cards up to the number of heads from your discard pile on top of your deck in any order.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

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

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      let heads: number = 0;
      store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        results.forEach(r => { heads += r ? 1 : 0; });

        if (heads === 0) {
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
          return state;
        }

        const deckTop = new CardList();

        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK,
          player.discard,
          {},
          { min: Math.min(heads, player.discard.cards.length), max: heads, allowCancel: false }
        ), selected => {
          cards = selected || [];

          const trainerCards = cards.filter(card => card instanceof TrainerCard);
          const nonTrainerCards = cards.filter(card => !(card instanceof TrainerCard));

          let canMoveTrainerCards = true;
          if (trainerCards.length > 0) {
            const discardEffect = new TrainerToDeckEffect(player, this);
            store.reduceEffect(state, discardEffect);
            canMoveTrainerCards = !discardEffect.preventDefault;
          }

          const cardsToMove = canMoveTrainerCards ? cards : nonTrainerCards;

          if (cardsToMove.length > 0) {
            cardsToMove.forEach(card => {
              player.discard.moveCardTo(card, deckTop);
            });

            return store.prompt(state, new OrderCardsPrompt(
              player.id,
              GameMessage.CHOOSE_CARDS_ORDER,
              deckTop,
              { allowCancel: false },
            ), order => {
              if (order === null) {
                return state;
              }

              deckTop.applyOrder(order);
              deckTop.moveToTopOfDestination(player.deck);
              player.supporter.moveCardTo(effect.trainerCard, player.discard);

              if (cardsToMove.length > 0) {
                return store.prompt(state, new ShowCardsPrompt(
                  opponent.id,
                  GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                  cardsToMove
                ), () => state);
              }

              return state;
            });
          }

          player.supporter.moveCardTo(effect.trainerCard, player.discard);
          return state;
        });
      });
    }
    return state;
  }
}