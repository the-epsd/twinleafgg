import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

export class GardevoirSpiritLink extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public set: string = 'PRC';
  public name: string = 'Gardevoir Spirit Link';
  public fullName: string = 'Gardevoir Spirit Link PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '130';

  public text: string =
    'Your turn does not end if the Pokémon this card is attached to becomes M Gardevoir-EX.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // aw yes look at this amazing effect i got cooking up here this is going to break the expanded meta into a million different pieces watch this
    return state;
  }

}
