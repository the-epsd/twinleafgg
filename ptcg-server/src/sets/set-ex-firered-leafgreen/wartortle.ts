import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Wartortle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Squirtle';
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Water Gun',
      cost: [W],
      damage: 20,
      damageCalculation: '+',
      text: 'Does 20 damage plus 10 more damage for each [W] Energy attached to Wartortle but not used to pay for this attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
    },
    {
      name: 'Smash Turn',
      cost: [W, C, C],
      damage: 40,
      text: 'After your attack, you may switch Wartortle with 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'RG';
  public name: string = 'Wartortle';
  public fullName: string = 'Wartortle RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Check attack cost
      const checkCost = new CheckAttackCostEffect(player, this.attacks[0]);
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

    if (AFTER_ATTACK(effect, 1, this)) {
      const player = effect.player;
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
    }

    return state;
  }
}

