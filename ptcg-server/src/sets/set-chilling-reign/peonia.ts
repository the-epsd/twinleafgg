import { CardList, ChooseCardsPrompt, ChoosePrizePrompt, OrderCardsPrompt } from '../../game';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CLEAN_UP_SUPPORTER } from '../../game/store/prefabs/prefabs';
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

      return store.prompt(state, new ChoosePrizePrompt(
        player.id,
        GameMessage.CHOOSE_PRIZE_CARD,
        { count: Math.min(3, player.getPrizeLeft()), allowCancel: false }
      ), chosenPrizes => {
        chosenPrizes = chosenPrizes || [];
        const hand = player.hand;

        chosenPrizes.forEach(prize => prize.moveTo(hand, 1));

        store.prompt(state, new ChooseCardsPrompt(
          player,
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

            // put rearranged cards into prize first prize slots available
            player.prizes.forEach(p => {
              if (p.cards.length === 0) {
                p.cards = newPrizeCards.cards.splice(0, 1);
                p.isSecret = true; // Only set the new cards to secret
              }
              // Remove this line: newPrizeCards.isSecret = true;
            });

            return state;
          });
        });

        CLEAN_UP_SUPPORTER(effect, player);

      });
    }
    return state;
  }
}