import { CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class UnitEnergyGRW extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'UPR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '137';

  public name = 'Unit Energy GRW';

  public fullName = 'Unit Energy GRW UPR';

  public text = 'This card provides [C] Energy.' +
    '' +
    'While this card is attached to a Pokémon, it provides [G], [R], and [W] Energy but provides only 1 Energy at a time.';

  blendedEnergies = [CardType.GRASS, CardType.FIRE, CardType.WATER];

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

      const grassCost = attackCosts?.reduce((sum, cost) => sum + cost.filter(t => t === CardType.GRASS).length, 0) || 0;
      const fireCost = attackCosts?.reduce((sum, cost) => sum + cost.filter(t => t === CardType.FIRE).length, 0) || 0;
      const waterCost = attackCosts?.reduce((sum, cost) => sum + cost.filter(t => t === CardType.WATER).length, 0) || 0;

      const existingGrass = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.GRASS).length : 0), 0);
      const existingFire = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.FIRE).length : 0), 0);
      const existingWater = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.WATER).length : 0), 0);

      const needsGrass = grassCost > existingGrass;
      const needsFire = fireCost > existingFire;
      const needsWater = waterCost > existingWater;

      const provides = [];
      if (needsGrass) provides.push(CardType.GRASS);
      if (needsFire) provides.push(CardType.FIRE);
      if (needsWater) provides.push(CardType.WATER);

      if (provides.length > 0) {
        effect.energyMap.push({ card: this, provides });
      } else {
        effect.energyMap.push({ card: this, provides: [CardType.COLORLESS] });
      }
      console.log('Unit Energy GRW is providing:', effect.energyMap[effect.energyMap.length - 1].provides);
    }

    return state;
  }
}