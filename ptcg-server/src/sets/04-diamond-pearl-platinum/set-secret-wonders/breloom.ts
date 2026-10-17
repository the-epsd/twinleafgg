import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Breloom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shroomish';
  public hp: number = 100;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Drain Punch',
    cost: [F, C],
    damage: 40,
    text: 'Remove from Breloom a number of damage counters equal to the amount of Energy attached to the Defending Pokémon.'
  },
  {
    name: 'Homing Uppercut',
    cost: [F, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'If the Defending Pokémon\'s Retreat Cost is 0, this attack does 60 damage plus 60 more damage.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Breloom';
  public fullName: string = 'Breloom SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Drain Punch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const checkEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
      store.reduceEffect(state, checkEnergy);
      const energyCount = checkEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
      if (energyCount > 0) {
        HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, energyCount * 10);
      }
    }

    // Homing Uppercut
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const checkRetreat = new CheckRetreatCostEffect(opponent);
      store.reduceEffect(state, checkRetreat);
      if (checkRetreat.cost.length === 0) {
        effect.damage += 60;
      }
    }

    return state;
  }
}
