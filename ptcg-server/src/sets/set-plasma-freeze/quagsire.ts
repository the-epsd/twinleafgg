import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Quagsire extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Wooper';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Laid-Back',
    powerType: PowerType.ABILITY,
    text: 'Any damage done to this Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Mud Gun',
      cost: [W, C, C],
      damage: 60,
      damageCalculation: '+' as '+',
      text: 'If this Pokémon has any [F] Energy attached to it, this attack does 30 more damage.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '22';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Quagsire';
  public fullName: string = 'Quagsire PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Laid-Back (passive - damage reduction)
    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
      const targetOwner = StateUtils.findOwner(state, effect.target);

      // Check ability lock
      try {
        const stub = new PowerEffect(targetOwner, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 20);
    }

    // Attack: Mud Gun
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Check if this Pokemon has any [F] Energy attached
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkEnergy);

      const hasFightingEnergy = checkEnergy.energyMap.some(em =>
        em.provides.includes(CardType.FIGHTING)
      );

      if (hasFightingEnergy) {
        effect.damage += 30;
      }
    }

    return state;
  }
}
