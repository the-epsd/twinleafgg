import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AbstractAttackEffect, ApplyWeaknessEffect, DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class WormadamSandyCloak extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Burmy Sandy Cloak';
  public hp: number = 80;
  public cardType: CardType[] = [F];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Sandy Cloak',
    powerType: PowerType.POKEBODY,
    text: 'Prevent all effects of attacks, excluding damage, done to Wormadam Sandy Cloak.'
  }];

  public attacks = [{
    name: 'Push Over',
    cost: [F, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Does 40 damage plus 10 damage for each Fighting Energy attached to Wormadam Sandy Cloak.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Wormadam Sandy Cloak';
  public fullName: string = 'Wormadam Sandy Cloak SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sandy Cloak
    if (
      effect instanceof AbstractAttackEffect
      && effect.target.cards.includes(this)
      && effect.target.getPokemonCard() === this
    ) {
      if (
        effect instanceof ApplyWeaknessEffect
        || effect instanceof PutDamageEffect
        || effect instanceof DealDamageEffect
      ) {
        return state;
      }

      const owner = StateUtils.findOwner(state, effect.target);
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      effect.preventDefault = true;
    }

    // Push Over
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkEnergy);
      const fightingCount = checkEnergy.energyMap.filter(em =>
        em.provides.includes(CardType.FIGHTING) || em.provides.includes(CardType.ANY)
      ).length;
      effect.damage += fightingCount * 10;
    }

    return state;
  }
}
