import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';

export class Floatzel extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Buizel';
  public hp: number = 90;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: 20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Screw Tail',
    cost: [W, C],
    damage: 30,
    text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
  },
  {
    name: 'Water Gun',
    cost: [W, W],
    damage: 40,
    damageCalculation: '+',
    text: 'Does 40 damage plus 20 more damage for each Water Energy attached to Floatzel but not used to pay for this attack\'s Energy cost. You can\'t add more than 40 damage in this way.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Floatzel';
  public fullName: string = 'Floatzel DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Screw Tail
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
        }
      });
    }

    // Water Gun
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const checkCost = new CheckAttackCostEffect(player, this.attacks[1]);
      state = store.reduceEffect(state, checkCost);
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);
      const waterEnergy = checkEnergy.energyMap.filter(e =>
        e.provides.includes(CardType.WATER)
      );
      const extraWaterEnergy = Math.min(waterEnergy.length - checkCost.cost.length, 2);
      if (extraWaterEnergy > 0) {
        effect.damage += extraWaterEnergy * 20;
      }
    }

    return state;
  }
}
