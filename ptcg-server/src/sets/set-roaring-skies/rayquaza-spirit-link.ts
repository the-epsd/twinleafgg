import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

export class RayquazaSpiritLink extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public set: string = 'ROS';
  public name: string = 'Rayquaza Spirit Link';
  public fullName: string = 'Rayquaza Spirit Link ROS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';

  public text: string =
    'Your turn does not end if the Pokémon this card is attached to becomes M Rayquaza-EX.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // aw yes look at this amazing effect i got cooking up here this is going to break the expanded meta into a million different pieces watch this
    return state;
  }

}
