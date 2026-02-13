import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Carracosta extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Tirtouga';
  public cardType: CardType = W;
  public hp: number = 140;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Solid Rock',
    powerType: PowerType.ABILITY,
    text: 'Any damage done to this Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Hydro Pump',
    cost: [W, W, C],
    damage: 60,
    damageCalculation: '+',
    text: 'Does 10 more damage for each [W] Energy attached to this Pokémon.'
  }];

  public set: string = 'NVI';
  public setNumber: string = '26';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Carracosta';
  public fullName: string = 'Carracosta NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Solid Rock - reduce damage taken by 20
    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
      const player = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 20);
    }

    // Hydro Pump - +10 per Water Energy
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkEnergy);

      let waterEnergy = 0;
      checkEnergy.energyMap.forEach(em => {
        waterEnergy += em.provides.filter(p => p === CardType.WATER).length;
      });

      effect.damage += 10 * waterEnergy;
    }

    return state;
  }
}
