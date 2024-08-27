import { CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class UnitEnergyFDY extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'FLI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '118';

  public name = 'Unit Energy FDY';

  public fullName = 'Unit Energy FDY FLI';

  public text = 'This card provides [C] Energy.' +
    '' +
    'While this card is attached to a Pokémon, it provides [F], [D], and [Y] Energy but provides only 1 Energy at a time.';

  blendedEnergies = [CardType.FIGHTING, CardType.DARK, CardType.FAIRY];

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

      const fightingCost = attackCosts?.reduce((sum, cost) => sum + cost.filter(t => t === CardType.FIGHTING).length, 0) || 0;
      const darkCost = attackCosts?.reduce((sum, cost) => sum + cost.filter(t => t === CardType.DARK).length, 0) || 0;
      const fairyCost = attackCosts?.reduce((sum, cost) => sum + cost.filter(t => t === CardType.FAIRY).length, 0) || 0;

      const existingFighting = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.FIGHTING).length : 0), 0);
      const existingDark = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.DARK).length : 0), 0);
      const existingFairy = existingEnergy.reduce((sum, e) => sum + (e instanceof EnergyCard ? e.provides.filter(t => t === CardType.FAIRY).length : 0), 0);

      const needsFighting = fightingCost > existingFighting;
      const needsDark = darkCost > existingDark;
      const needsFairy = fairyCost > existingFairy;

      const provides = [];
      if (needsFighting) provides.push(CardType.FIGHTING);
      if (needsDark) provides.push(CardType.DARK);
      if (needsFairy) provides.push(CardType.FAIRY);

      if (provides.length > 0) {
        effect.energyMap.push({ card: this, provides });
      } else {
        effect.energyMap.push({ card: this, provides: [CardType.COLORLESS] });
      }

      console.log('Unit Energy FDY is providing:', effect.energyMap[effect.energyMap.length - 1].provides);
    }

    return state;
  }
}