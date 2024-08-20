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

  blendedEnergies = [CardType.FAIRY, CardType.FIGHTING, CardType.DARK];

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

      const needsFighting = attackCosts?.some(cost => cost.includes(CardType.FIGHTING) && !existingEnergy.some(e => e instanceof EnergyCard && e.provides.includes(CardType.FIGHTING)));
      const needsDark = attackCosts?.some(cost => cost.includes(CardType.DARK) && !existingEnergy.some(e => e instanceof EnergyCard && e.provides.includes(CardType.DARK)));
      const needsFairy = attackCosts?.some(cost => cost.includes(CardType.FAIRY) && !existingEnergy.some(e => e instanceof EnergyCard && e.provides.includes(CardType.FAIRY)));

      const provides = [];
      if (needsFighting) provides.push(CardType.FIGHTING);
      if (needsDark) provides.push(CardType.DARK);
      if (needsFairy) provides.push(CardType.FAIRY);

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