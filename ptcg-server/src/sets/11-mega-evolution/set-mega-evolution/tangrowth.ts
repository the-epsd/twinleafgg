import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';

export class Tangrowth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Tangela';
  public hp: number = 150;
  public cardType: CardType = G;
  public weakness = [{ type: R }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Absorb',
    cost: [G, C],
    damage: 30,
    text: 'Heal 30 damage from this Pokémon.'
  },
  {
    name: 'Pumped-Up Whip',
    cost: [G, G, C, C],
    damage: 120,
    damageCalculation: '+',
    text: 'If this Pokémon has at least 2 extra Energy attached (in addition to this attack\'s cost), this attack does 140 more damage.'
  }];

  public regulationMark = 'I';
  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Tangrowth';
  public fullName: string = 'Tangrowth MEG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Absorb
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(30, effect, store, state);
    }

    // Pumped-Up Whip
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      // Check attack cost
      const checkCost = new CheckAttackCostEffect(player, this.attacks[0]);
      state = store.reduceEffect(state, checkCost);
      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);
      // Count total attached energy
      const totalEnergy = checkEnergy.energyMap.reduce((sum, energy) => sum + energy.provides.length, 0);
      const attackCost = checkCost.cost.length;
      const extraEnergy = totalEnergy - attackCost;
      if (extraEnergy >= 2) {
        effect.damage += 80;
      }
    }

    return state;
  }
}
