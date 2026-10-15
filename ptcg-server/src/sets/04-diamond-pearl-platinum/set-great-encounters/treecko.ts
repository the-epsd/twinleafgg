import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';

export class Treecko extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +10 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Energy Ball',
    cost: [C],
    damage: 10,
    damageCalculation: '+',
    text: 'Does 10 damage plus 10 more damage for each Energy attached to Treecko but not used to pay for this attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
  },
  {
    name: 'Absorb',
    cost: [G, C],
    damage: 20,
    text: 'Remove 1 damage counter from Treecko.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';
  public name: string = 'Treecko';
  public fullName: string = 'Treecko GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Energy Ball
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkCost = new CheckAttackCostEffect(player, this.attacks[0]);
      state = store.reduceEffect(state, checkCost);
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);
      const extraEnergy = checkEnergy.energyMap.length - checkCost.cost.length;
      if (extraEnergy === 1) {
        effect.damage += 10;
      } else if (extraEnergy >= 2) {
        effect.damage += 20;
      }
    }

    // Absorb
    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 10);
    }

    return state;
  }
}
