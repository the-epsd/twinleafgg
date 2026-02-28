import { State, StoreLike } from '../../game';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Wailmer extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Rest',
    cost: [C],
    damage: 0,
    text: 'Remove all Special Conditions and 4 damage counters from Wailmer (all if there are less than 4). Wailmer is now Asleep.'
  },
  {
    name: 'Water Gun',
    cost: [W, C],
    damage: 20,
    damageCalculation: '+',
    text: 'This attack does 20 damage plus 10 more damage for each [W] Energy attached to Wailmer but not used to pay for this attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
  }];

  public set: string = 'RS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Wailmer';
  public fullName: string = 'Wailmer RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const conditions = player.active.specialConditions.slice();
      conditions.forEach((condition: SpecialCondition) => {
        player.active.removeSpecialCondition(condition);
      });

      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 40);
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Check attack cost
      const checkCost = new CheckAttackCostEffect(player, this.attacks[1]);
      state = store.reduceEffect(state, checkCost);

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      // Filter for only Water Energy
      const waterEnergy = checkEnergy.energyMap.filter(e =>
        e.provides.includes(CardType.WATER));

      // Get number of extra Water energy  
      const extraWaterEnergy = waterEnergy.length - checkCost.cost.length;

      // Apply damage boost based on extra Water energy
      if (extraWaterEnergy == 1) effect.damage += 10;
      if (extraWaterEnergy == 2) effect.damage += 20;
    }

    return state;
  }
}