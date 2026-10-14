import {
  SpecialCondition,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerType,
  Player,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { TRAINER_TARGET_BLOCKED } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class YellHorn extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'D';
  public set: string = 'DAA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '173';
  public name: string = 'Yell Horn';
  public fullName: string = 'Yell Horn DAA';
  public text: string = 'Both Active Pokémon are now Confused.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.addSpecialCondition(SpecialCondition.CONFUSED);
      if (!TRAINER_TARGET_BLOCKED(store, state, player, this, opponent.active)) {
        opponent.active.addSpecialCondition(SpecialCondition.CONFUSED);
      }
      return state;
    }
    return state;
  }
}
