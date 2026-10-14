import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_UP_TO_X_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Erika extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '191';
  public name: string = 'Erika';
  public fullName: string = 'Erika CEC';
  public text: string =
    'Each player may draw up to 3 cards. You draw first. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // You draw first
      DRAW_UP_TO_X_CARDS(store, state, player, 3);

      // Then opponent may draw up to 3
      DRAW_UP_TO_X_CARDS(store, state, opponent, 3);
    }

    return state;
  }
}
