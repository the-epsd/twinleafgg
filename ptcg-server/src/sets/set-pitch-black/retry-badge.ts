import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

export class RetryBadge extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'M5';
  public setNumber: string = '74';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Retry Badge';
  public fullName: string = 'Retry Badge M5';
  public text: string = 'Once during your turn, after you flip any coins for an attack of the [C] Pokémon this card is attached to, you may ignore the results of those coin flips and begin flipping those coins again.';

  public reduceEffect(_store: StoreLike, state: State, _effect: Effect): State {
    return state;
  }
}
