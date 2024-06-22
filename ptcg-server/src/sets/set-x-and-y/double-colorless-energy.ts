import { State, StoreLike } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';

export class DoubleColorlessEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'XY';

  public name = 'Double Colorless Energy';

  public fullName = 'Double Colorless Energy XY';

  public cardImage: string = 'assets/cardback.png';

  public text = 'Double Colorless Energy provides [C][C] Energy.';

  public setNumber: string = '130';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      this.provides = [ CardType.COLORLESS, CardType.COLORLESS ]; 
    }
    return state;
  }
}
