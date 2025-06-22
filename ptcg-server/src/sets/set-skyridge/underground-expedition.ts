import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { GameError, GameMessage, CardList, ChooseCardsPrompt } from '../../game';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class UndergroundExpedition extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'SK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '140';
  public name: string = 'Underground Expedition';
  public fullName: string = 'Underground Expedition SK';

  public text: string = 'Look at the bottom 4 cards of your deck and put 2 of them into your hand. Put the other cards back on the bottom of your deck in any order.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      // Take the bottom 4 cards of the deck using slice
      const numBottom = Math.min(4, player.deck.cards.length);
      const bottomCards = player.deck.cards.slice(-numBottom);

      // Remove those cards from the deck
      player.deck.cards.splice(-numBottom, numBottom);

      const bottomCardList = new CardList();
      bottomCardList.cards = bottomCards;

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        bottomCardList,
        {},
        { min: 2, max: 2, allowCancel: false }
      ), selected => {
        // Put chosen cards into hand
        for (const card of selected) {
          bottomCardList.moveCardTo(card, player.hand);
        }

        // The rest go back to the bottom of the deck
        while (bottomCardList.cards.length > 0) {
          bottomCardList.moveCardTo(bottomCardList.cards[0], player.deck);
        }

        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
      });
    }
    return state;
  }

}
