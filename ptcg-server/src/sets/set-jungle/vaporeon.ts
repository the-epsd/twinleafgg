import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Vaporeon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C];
  public evolvesFrom = 'Eevee';

  public attacks = [{
    name: 'Quick Attack',
    cost: [C, C],
    damage: 10,
    text: 'Flip a coin. If heads, this attack does 10 damage plus 20 more damage; if tails, this attack does 10 damage.'
  }, {
    name: 'Water Gun',
    cost: [W, W, C],
    damage: 30,
    text: 'Does 30 damage plus 10 more damage for each [W] Energy attached to Vaporeon but not used to pay for this attack\'s Energy cost. Extra [W] Energy after the 2nd doesn\'t count.'
  }];

  public set: string = 'JU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Vaporeon';
  public fullName: string = 'Vaporeon JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          effect.damage += 20;
        } else {
          effect.damage += 10;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Check attack cost
      const checkCost = new CheckAttackCostEffect(player, this.attacks[1]);
      state = store.reduceEffect(state, checkCost);

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      // Count total WATER energy provided
      const totalWaterEnergy = checkEnergy.energyMap.reduce((sum, energy) => {
        return sum + energy.provides.filter(type => type === CardType.WATER).length;
      }, 0);

      // Get number of extra WATER energy  
      const extraWaterEnergy = totalWaterEnergy - checkCost.cost.length;

      effect.damage += extraWaterEnergy * 10;
    }

    return state;
  }

}