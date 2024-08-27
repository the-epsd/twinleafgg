import { CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class UnitEnergyLPM extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'UPR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '138';

  public name = 'Unit Energy LPM';

  public fullName = 'Unit Energy LPM UPR';

  public text = 'This card provides [C] Energy.' +
    '' +
    'While this card is attached to a Pokémon, it provides [L], [P], and [M] Energy but provides only 1 Energy at a time.';

  blendedEnergies = [CardType.LIGHTNING, CardType.PSYCHIC, CardType.METAL];

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

      const lightningCost = attackCosts?.reduce((sum, cost) => sum + cost.filter(t => t === CardType.LIGHTNING).length, 0) || 0;
      const psychicCost = attackCosts?.reduce((sum, cost) => sum + cost.filter(t => t === CardType.PSYCHIC).length, 0) || 0;
      const metalCost = attackCosts?.reduce((sum, cost) => sum + cost.filter(t => t === CardType.METAL).length, 0) || 0;

      const existingLightning = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.LIGHTNING).length : 0), 0);
      const existingPsychic = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.PSYCHIC).length : 0), 0);
      const existingMetal = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.METAL).length : 0), 0);

      const needsLightning = lightningCost > existingLightning;
      const needsPsychic = psychicCost > existingPsychic;
      const needsMetal = metalCost > existingMetal;

      const provides = [];
      if (needsLightning) provides.push(CardType.LIGHTNING);
      if (needsPsychic) provides.push(CardType.PSYCHIC);
      if (needsMetal) provides.push(CardType.METAL);

      if (provides.length > 0) {
        effect.energyMap.push({ card: this, provides });
      } else {
        effect.energyMap.push({ card: this, provides: [CardType.COLORLESS] });
      }
      console.log('Unit Energy LPM is providing:', effect.energyMap[effect.energyMap.length - 1].provides);
    }

    return state;
  }
}