import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../../game/store/prefabs/attack-effects';

export class Pupitar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Larvitar';
  public hp: number = 80;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G, value: +20 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Energy Protection',
    powerType: PowerType.POKEBODY,
    text: 'Any damage done to Pupitar by attacks is reduced by 10 for each Energy attached to Pupitar (after applying Weakness and Resistance). You can\'t reduce more than 30 damage in this way.'
  }];

  public attacks = [{
    name: 'Rock Smash',
    cost: [C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 damage plus 20 more damage.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Pupitar';
  public fullName: string = 'Pupitar SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Energy Protection
    if ((effect instanceof PutDamageEffect || effect instanceof DealDamageEffect)
      && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (effect.player === owner) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      const checkEnergy = new CheckProvidedEnergyEffect(owner, effect.target);
      store.reduceEffect(state, checkEnergy);
      const energyCount = checkEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
      const reduction = Math.min(30, energyCount * 10);
      effect.damage = Math.max(0, effect.damage - reduction);
    }

    // Rock Smash
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }
}
