
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';

import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Torkoal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [R];
  public hp: number = 130;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Stampede',
    cost: [C, C],
    damage: 30,
    text: ''
  }, {
    name: 'Concentrated Fire',
    cost: [R, C, C],
    damage: 80,
    damageCalculation: 'x',
    text: 'Flip a coin for each [R] Energy attached to this Pokémon. This attack does 80 damage for each heads.'
  }];

  public set: string = 'SVI';
  public name: string = 'Torkoal';
  public fullName: string = 'Torkoal SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';

  public regulationMark: string = 'G';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      const totalEnergy = checkEnergy.energyMap.reduce((sum, energy) => {
        return sum + energy.provides.filter(p => p === CardType.FIRE || p === CardType.ANY).length;
      }, 0);

      if (totalEnergy > 0) {
        MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, totalEnergy, results => {
          effect.damage = results.filter(r => r).length * 80;
        });
      } else {
        effect.damage = 0;
      }
    }

    return state;
  }

}