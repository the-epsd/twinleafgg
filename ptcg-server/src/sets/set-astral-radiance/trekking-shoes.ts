import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CardList } from '../../game/store/state/card-list';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { ConfirmCardsPrompt } from '../../game/store/prompts/confirm-cards-prompt';

export class TrekkingShoes extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'ASR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '156';

  public name: string = 'Trekking Shoes';

  public fullName: string = 'Trekking Shoes ASR';

  public text: string =
    'Look at the top card of your deck. You may put that card into your hand. If you don\'t, discard that card and draw a card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 1);

      return store.prompt(state, new ConfirmCardsPrompt(
        player.id,
        GameMessage.TREKKING_SHOES,
        deckTop.cards, // Fix error by changing toArray() to cards
        { allowCancel: true },
      ), selected => {

        if (selected !== null) {
          // Add card to hand
          deckTop.moveCardsTo(deckTop.cards, player.hand);
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
        } else {

          // Discard card
          deckTop.moveTo(player.discard);

          // Draw a card
          player.deck.moveTo(player.hand, 1);
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
      });
    }
    return state;
  }
}