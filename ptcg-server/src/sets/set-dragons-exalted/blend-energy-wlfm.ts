import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class BlendEnergyWLFM extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'DRX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '118';

  public name = 'Blend Energy WLFM';

  public fullName = 'Blend Energy WLFM DRX';

  public text = 'This card provides [C] Energy. When attached to a Pokémon, this card provides [W], [L], [F], or [M] but only 1 Energy at a time.';

  public blendedEnergies = [CardType.WATER, CardType.LIGHTNING, CardType.FIGHTING, CardType.METAL];

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