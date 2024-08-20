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

      const needsLightning = attackCosts?.some(cost => cost.includes(CardType.LIGHTNING) && !existingEnergy.some(e => e instanceof EnergyCard && e.provides.includes(CardType.LIGHTNING)));
      const needsPsychic = attackCosts?.some(cost => cost.includes(CardType.PSYCHIC) && !existingEnergy.some(e => e instanceof EnergyCard && e.provides.includes(CardType.PSYCHIC)));
      const needsMetal = attackCosts?.some(cost => cost.includes(CardType.METAL) && !existingEnergy.some(e => e instanceof EnergyCard && e.provides.includes(CardType.METAL)));

      const provides = [];
      if (needsLightning) provides.push(CardType.LIGHTNING);
      if (needsPsychic) provides.push(CardType.PSYCHIC);
      if (needsMetal) provides.push(CardType.METAL);

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