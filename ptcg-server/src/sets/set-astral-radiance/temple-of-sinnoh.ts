import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { State, EnergyCard, StateUtils, Card, StoreLike } from '../../game';
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

    //   if (effect instanceof AttachEnergyEffect && StateUtils.getStadiumCard(state) === this) {

    //     const target = effect.target;
    //     const player = StateUtils.findOwner(state, target);

    //     const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, target);
    //     store.reduceEffect(state, checkProvidedEnergyEffect);
    //     const energyMap = checkProvidedEnergyEffect.energyMap;
    //     const hasDarknessEnergy = energyMap.some(energyMap => energyMap.card.energyType === EnergyType.SPECIAL);

    //     if (hasDarknessEnergy) {
    //       energyMap.forEach(energyMap => {
    //         energyMap.provides = [CardType.COLORLESS];
    //       });
    //       // effect.preventDefault = true;
    //     }

    //     return state;
    //   }

    //   if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
    //     throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    //   }

    //   return state;
    // }



    if (effect instanceof EnergyCard && StateUtils.getStadiumCard(state) === this) {
      (effect as any).energyMap.forEach(({ card, provides }: { card: Card, provides: CardType[] }) => {
        if (card.superType === SuperType.ENERGY && card.energyType === EnergyType.SPECIAL) {
          provides = [CardType.COLORLESS];
          effect.preventDefault;
          return state;
        }
      });
    }
    return state;
  }
}