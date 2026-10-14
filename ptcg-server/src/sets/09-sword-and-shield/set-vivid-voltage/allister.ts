import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard, StoreLike, State, GameError, GameMessage, Player } from '../../../game';
import { DRAW_CARDS, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import {
  DISCARD_X_CARDS_FROM_YOUR_HAND,
  WAS_TRAINER_USED,
} from '../../../game/store/prefabs/trainer-prefabs';

export class Allister extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'D';
  public set: string = 'VIV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '146';
  public name: string = 'Allister';
  public fullName: string = 'Allister VIV';
  public text: string =
    'Draw 3 cards. If you drew any cards in this way, discard up to 3 cards from your hand. (You must discard at least 1 card.) You may play only 1 Supporter card during your turn.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;
      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [effect.trainerCard], sourceCard: this });
      effect.preventDefault = true;

      const deckSize = player.deck.cards.length;
      const drawnCount = Math.min(3, deckSize);

      DRAW_CARDS(store, state, player, 3);

      // If we drew any cards, must discard at least 1 (up to 3)
      if (drawnCount > 0) {
        DISCARD_X_CARDS_FROM_YOUR_HAND(effect, store, state, 1, 3);
      }
    }

    return state;
  }
}
