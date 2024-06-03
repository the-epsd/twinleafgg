import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { State, EnergyCard, StateUtils, StoreLike, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class TempleofSinnoh extends TrainerCard {

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '155';
  
  public trainerType = TrainerType.STADIUM;

  public set = 'ASR';

  public name = 'Temple of Sinnoh';

  public fullName = 'Temple of Sinnoh ASR';

  public text = 'All Special Energy attached to Pokémon (both yours and your opponent\'s) provide C Energy and have no other effect.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect & EnergyCard): State {

    if (effect instanceof EnergyCard && StateUtils.getStadiumCard(state) === this) {

      // Set isBlocked to true for all EnergyCard instances
      effect.cards.cards.forEach((card: Card) => {
        if (card instanceof EnergyCard) {
          card.isBlocked = true;
        }
      });
    }
    return state;
  }
}