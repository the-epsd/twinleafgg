import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PREVENT_EFFECTS_OF_OPPONENTS_ABILITIES } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_TOOL_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class StealthyHood extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.TOOL;
  public name: string = 'Stealthy Hood';
  public fullName: string = 'Stealthy Hood UNB';
  public set: string = 'UNB';
  public setNumber: string = '186';
  public cardImage: string = 'assets/cardback.png';
  public text: string =
    "Prevent all effects of your opponent's Abilities done to the Pokémon this card is attached to. Remove any such existing effects.";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    PREVENT_EFFECTS_OF_OPPONENTS_ABILITIES(state, effect, (target) => {
      if (!target.tools.includes(this)) {
        return false;
      }
      const owner = StateUtils.findOwner(state, target);
      if (IS_TOOL_BLOCKED(store, state, owner, this)) {
        return false;
      }
      return true;
    });
    return state;
  }
}
