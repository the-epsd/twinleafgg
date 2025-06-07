import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class DarkMetalEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'TRR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name = 'Dark Metal Energy';
  public fullName = 'Dark Metal Energy TRR';

  public text = 'Attach Dark Metal Energy to 1 of your Pokémon. While in play, Dark Metal Energy provides [D] Energy and [M] Energy, but provides only 1 Energy at a time. (Doesn\'t count as a basic Energy card when not in play and has no effect other than providing Energy.)';

  public blendedEnergies = [CardType.DARK, CardType.METAL];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      try {
        // Always add the base "EnergyEffect"
        const energyEffect = new EnergyEffect(effect.player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      // Find the first energy type that's not already provided by other energies
      const neededType = this.blendedEnergies.find(type =>
        !effect.energyMap.some(energy => energy.provides.includes(type))
      );

      if (neededType) {
        // Only provide the specific energy type that's needed
        effect.energyMap.push({
          card: this,
          provides: [neededType]
        });
      }
    }

    return state;
  }
}