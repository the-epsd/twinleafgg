import { CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class BlendEnergyGRPD extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'DRX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '117';

  public name = 'Blend Energy GRPD';

  public fullName = 'Blend Energy GRPD DRX';

  public text = 'This card provides [C] Energy. When this card is attached to a Pokémon, this card provides [G], [R], [P], or [D] Energy but provides only 1 Energy at a time.';

  blendedEnergies = [CardType.GRASS, CardType.FIRE, CardType.PSYCHIC, CardType.DARK];

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
      const psychicCost = attackCosts?.reduce((sum, cost) => sum + cost.filter(t => t === CardType.PSYCHIC).length, 0) || 0;
      const darkCost = attackCosts?.reduce((sum, cost) => sum + cost.filter(t => t === CardType.DARK).length, 0) || 0;

      const existingGrass = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.GRASS).length : 0), 0);
      const existingFire = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.FIRE).length : 0), 0);
      const existingPsychic = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.PSYCHIC).length : 0), 0);
      const existingDark = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.DARK).length : 0), 0);

      const needsGrass = grassCost > existingGrass;
      const needsFire = fireCost > existingFire;
      const needsPsychic = psychicCost > existingPsychic;
      const needsDark = darkCost > existingDark;

      const provides = [];
      if (needsGrass) provides.push(CardType.GRASS);
      if (needsFire) provides.push(CardType.FIRE);
      if (needsPsychic) provides.push(CardType.PSYCHIC);
      if (needsDark) provides.push(CardType.DARK);

      if (provides.length > 0) {
        effect.energyMap.push({ card: this, provides });
      } else {
        effect.energyMap.push({ card: this, provides: [CardType.COLORLESS] });
      }

      console.log('Blend Energy GRPD is providing:', effect.energyMap[effect.energyMap.length - 1].provides);
    }

    return state;
  }
}