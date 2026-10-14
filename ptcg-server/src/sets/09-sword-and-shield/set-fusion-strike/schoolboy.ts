import { Effect } from '../../../game/store/effects/effect';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StateUtils } from '../../../game/store/state-utils';
import { DRAW_CARDS } from '../../../game/store/prefabs/prefabs';
import { Player } from '../../../game';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Schoolboy extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'E';
  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '238';
  public name: string = 'Schoolboy';
  public fullName: string = 'Schoolboy FST';
  public text: string =
    'Draw 2 cards. If your opponent has exactly 2, 4, or 6 Prize cards remaining, draw 2 more cards.';

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
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      DRAW_CARDS(store, state, player, 2);

      if (
        opponent.getPrizeLeft() === 1 ||
        opponent.getPrizeLeft() === 3 ||
        opponent.getPrizeLeft() === 5
      ) {
        DRAW_CARDS(store, state, player, 2);
      }

      return state;
    }
    return state;
  }
}
