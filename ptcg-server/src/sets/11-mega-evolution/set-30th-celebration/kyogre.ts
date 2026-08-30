import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Kyogre extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 140;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Hydro Pump',
    cost: [C, C, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each [W] Energy attached to this Pokémon.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Kyogre';
  public fullName: string = 'Kyogre 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hydro Pump
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const checkEnergy = new CheckProvidedEnergyEffect(effect.player);
      store.reduceEffect(state, checkEnergy);
      const waterCount = checkEnergy.energyMap.reduce((sum, em) =>
        sum + em.provides.filter(t => t === CardType.WATER || t === CardType.ANY).length, 0);
      effect.damage += waterCount * 30;
    }

    return state;
  }
}
