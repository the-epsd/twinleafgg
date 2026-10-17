import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { DRAW_CARDS } from '../../../game/store/prefabs/prefabs';

export class Dancer extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'E';
  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '232';
  public name: string = 'Dancer';
  public fullName: string = 'Dancer FST 232';
  public text: string =
    "Draw 2 cards. If you go second and it's your first turn, draw 3 more cards. You may play only 1 Supporter card during your turn.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Draw 2 cards
      DRAW_CARDS(store, state, player, 2);

      // If you go second and it's your first turn (turn 2), draw 3 more
      if (state.turn === 2) {
        DRAW_CARDS(store, state, player, 3);
      }
    }

    return state;
  }
}
