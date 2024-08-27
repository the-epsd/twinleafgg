import { CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
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

  public text = 'This card provides C Energy. When this card is attached to a Pokémon, this card provides W, L, F, or M Energy but provides only 1 Energy at a time.';

  blendedEnergies = [CardType.WATER, CardType.LIGHTNING, CardType.FIGHTING, CardType.METAL];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const pokemon = effect.source;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      const pokemonCard = pokemon.getPokemonCard();
      const attackCosts = pokemonCard?.attacks.map(attack => attack.cost);
      const existingEnergy = pokemon.cards.filter(c => c.superType === SuperType.ENERGY);

      const waterCost = attackCosts?.reduce((sum, cost) => sum + cost.filter(t => t === CardType.WATER).length, 0) || 0;
      const lightningCost = attackCosts?.reduce((sum, cost) => sum + cost.filter(t => t === CardType.LIGHTNING).length, 0) || 0;
      const fightingCost = attackCosts?.reduce((sum, cost) => sum + cost.filter(t => t === CardType.FIGHTING).length, 0) || 0;
      const metalCost = attackCosts?.reduce((sum, cost) => sum + cost.filter(t => t === CardType.METAL).length, 0) || 0;

      const existingWater = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.WATER).length : 0), 0);
      const existingLightning = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.LIGHTNING).length : 0), 0);
      const existingFighting = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.FIGHTING).length : 0), 0);
      const existingMetal = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.METAL).length : 0), 0);

      const needsWater = waterCost > existingWater;
      const needsLightning = lightningCost > existingLightning;
      const needsFighting = fightingCost > existingFighting;
      const needsMetal = metalCost > existingMetal;

      const provides = [];
      if (needsWater) provides.push(CardType.WATER);
      if (needsLightning) provides.push(CardType.LIGHTNING);
      if (needsFighting) provides.push(CardType.FIGHTING);
      if (needsMetal) provides.push(CardType.METAL);

      if (provides.length > 0) {
        effect.energyMap.push({ card: this, provides });
      } else {
        effect.energyMap.push({ card: this, provides: [CardType.COLORLESS] });
      }

      console.log('Blend Energy WLFM is providing:', effect.energyMap[effect.energyMap.length - 1].provides);
    }

    return state;
  }
}