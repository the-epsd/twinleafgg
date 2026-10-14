import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { CardList } from '../../../game/store/state/card-list';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { ConfirmCardsPrompt } from '../../../game/store/prompts/confirm-cards-prompt';
import { Player } from '../../../game';
import { DRAW_CARDS, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class TrekkingShoes extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '156';
  public name: string = 'Trekking Shoes';
  public fullName: string = 'Trekking Shoes ASR';
  public text: string =
    "Look at the top card of your deck. You may put that card into your hand. If you don't, discard that card and draw a card.";

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const deckTop = new CardList();
      MOVE_CARDS(store, state, player.deck, deckTop, { count: 1, sourceCard: this });

      return store.prompt(
        state,
        new ConfirmCardsPrompt(player.id, GameMessage.TREKKING_SHOES, deckTop.cards, {
          allowCancel: true,
        }),
        (selected) => {
          if (selected !== null) {
            // Add card to hand
            MOVE_CARDS(store, state, deckTop, player.hand, {
              cards: deckTop.cards,
              sourceCard: this,
            });
          } else {
            // Discard card
            MOVE_CARDS(store, state, deckTop, player.discard, { sourceCard: this });

            // Draw a card
            DRAW_CARDS(store, state, player, 1);
          }
        },
      );
    }
    return state;
  }
}
