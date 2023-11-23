import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, EnergyCard, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class TempleofSinnoh extends TrainerCard {

  public regulationMark = 'F';

  public set2: string = 'astralradiance';

  public setNumber: string = '155';
  
  public trainerType = TrainerType.STADIUM;

  public set = 'ASR';

  public name = 'Temple of Sinnoh';

  public fullName = 'All Special Energy attached to Pokémon (both yours and your opponent\'s) provide C Energy and have no other effect.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect & EnergyCard): State {
    if (effect instanceof EnergyCard && StateUtils.getStadiumCard(state) === this) {

      (effect as any).energyMap.forEach(({ card, provides }: { card: Card, provides: CardType[] }) => {
        if (card.superType === SuperType.ENERGY) {
          if (EnergyType.SPECIAL)
            provides = [CardType.COLORLESS];
          effect.preventDefault = true;
          return state;
        }
      });

    }


    return state;
  }






}
