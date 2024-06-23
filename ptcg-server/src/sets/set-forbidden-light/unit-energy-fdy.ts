import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class UnitEnergyFDY extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'FLI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '118';

  public name = 'Unit Energy FDY';

  public fullName = 'Unit Energy FDY FLI';

  public text = 'This card provides [C] Energy.' + 
  '' +
  'While this card is attached to a Pokémon, it provides [F], [D], and [Y] Energy but provides only 1 Energy at a time.';

  blendedEnergies = [ CardType.FAIRY, CardType.FIGHTING, CardType.DARK ]

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      const pokemonCard = effect.source.getPokemonCard();
      const attackCost = pokemonCard && pokemonCard.attacks[0].cost;
      const providedEnergy: CardType[] = [];

      if (attackCost) {
        const attachedEnergy = effect.source.cards.filter(
          card => card instanceof EnergyCard
        ) as EnergyCard[];

        const attachedEnergyTypes = new Set(
          attachedEnergy.flatMap(energy => energy.provides)
        );

        for (const costType of attackCost) {
          if (!attachedEnergyTypes.has(costType)) {
            if (costType === CardType.FAIRY || costType === CardType.DARK || costType === CardType.FIGHTING) {
              providedEnergy.push(costType);
            }
          }
        }
      }

      if (providedEnergy.length > 0) {
        effect.energyMap.push({ card: this, provides: providedEnergy });
      }

      return state;
    }

    return state;
  }
}