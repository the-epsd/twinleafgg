import { StoreLike, State } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

export class DoubleColorlessEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '96';

  public name = 'Double Colorless Energy';

  public fullName = 'Double Colorless Energy BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      this.provides = [CardType.COLORLESS, CardType.COLORLESS];
    }
    return state;
  }
}