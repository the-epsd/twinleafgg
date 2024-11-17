import { CardList, ChooseCardsPrompt, OrderCardsPrompt } from '../../game';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Peonia extends TrainerCard {

  public regulationMark = 'E';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '149';

  public name: string = 'Peonia';

  public fullName: string = 'Peonia CRE';

  public text: string =
    'Put up to 3 Prize cards into your hand. Then, for each Prize card you put into your hand in this way, put a card from your hand face down as a Prize card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // we'll discard peonia later
      effect.preventDefault = true;

      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      const allPrizeCards = new CardList();
      // allPrizeCards.isSecret = true;  // Set the CardList as secret
      // allPrizeCards.isPublic = false;
      // allPrizeCards.faceUpPrize = false;
      player.prizes.forEach(prizeList => {
        allPrizeCards.cards.push(...prizeList.cards);
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_PRIZE_CARD,
        allPrizeCards,
        {},
        { min: 3, max: 3, allowCancel: false }
      ), chosenPrizes => {
        chosenPrizes = chosenPrizes || [];
        const hand = player.hand;

        // Find all prize lists containing the chosen cards
        const chosenPrizeIndices = chosenPrizes.map(prize =>
          player.prizes.findIndex(prizeList => prizeList.cards.includes(prize))
        ).filter(index => index !== -1);

        // Move chosen prizes to hand
        chosenPrizes.forEach(prize => {
          const prizeList = player.prizes.find(list => list.cards.includes(prize));
          if (prizeList) {
            prizeList.moveCardTo(prize, hand);
          }
        });

        store.prompt(state, new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARDS_TO_RETURN_TO_PRIZES,
          player.hand,
          {},
          { min: chosenPrizes.length, max: chosenPrizes.length, allowCancel: false }
        ), cards => {
          cards = cards || [];
          const newPrizeCards = new CardList();
          player.hand.moveCardsTo(cards, newPrizeCards);

          return store.prompt(state, new OrderCardsPrompt(
            player.id,
            GameMessage.CHOOSE_CARDS_ORDER,
            newPrizeCards,
            { allowCancel: false }
          ), (rearrangedCards) => {
            newPrizeCards.applyOrder(rearrangedCards);

            // Move ordered cards to original prize slots
            chosenPrizeIndices.forEach((prizeIndex, index) => {
              if (newPrizeCards.cards[0] && player.prizes[prizeIndex]) {
                newPrizeCards.moveCardTo(newPrizeCards.cards[0], player.prizes[prizeIndex]);
                player.prizes[prizeIndex].isSecret = true;
              }
            });

            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
          });
        });
      });
    }
    return state;
  }
}