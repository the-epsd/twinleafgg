import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
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

  public text = 'This card provides C Energy. When this card is attached to a Pokémon, this card provides W, L, F, or M Energy but provides only 1 Energy at a time.';

  blendedEnergies = [CardType.WATER, CardType.LIGHTNING, CardType.FIGHTING, CardType.METAL];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckAttackCostEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;
      const pokemon = effect.player.active;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      const attackCosts = effect instanceof CheckAttackCostEffect ? effect.attack.cost : [];
      const initialCosts = [...attackCosts];
      console.log(`[BlendEnergy] Initial attack costs: ${initialCosts.join(', ') || 'None'}`);

      let checkEnergy: CheckProvidedEnergyEffect;
      if (effect instanceof CheckProvidedEnergyEffect) {
        checkEnergy = effect;
      } else {
        checkEnergy = new CheckProvidedEnergyEffect(player, pokemon);
        store.reduceEffect(state, checkEnergy);
      }

      const alreadyProvided = checkEnergy.energyMap.flatMap(e => e.provides);
      const blendProvided = checkEnergy.energyMap
        .filter(e => e.card instanceof BlendEnergyWLFM)
        .flatMap(e => e.provides);

      let neededType: CardType | undefined;
      for (const cost of initialCosts) {
        if (this.blendedEnergies.includes(cost) && !alreadyProvided.includes(cost) && !blendProvided.includes(cost)) {
          neededType = cost;
          break;
        }
      }

      if (neededType) {
        checkEnergy.energyMap.push({
          card: this,
          provides: [neededType]
        });
        console.log(`[BlendEnergy] Provided energy type: ${neededType}`);
      }

      const finalEnergy = checkEnergy.energyMap.flatMap(e => e.provides);
      console.log(`[BlendEnergy] Final energy provided: ${finalEnergy.join(', ') || 'None'}`);
      console.log(`[BlendEnergy] Final attack cost check: ${effect.attack.cost.join(', ')}`);
    }
    return state;


  }
}