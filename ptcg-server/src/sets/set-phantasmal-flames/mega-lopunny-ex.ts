import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { MOVED_TO_ACTIVE_THIS_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterDamageEffect, ApplyWeaknessEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game';

export class MegaLopunnyex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Buneary';
  public cardType: CardType = C;
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_SV_MEGA];
  public hp: number = 330;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Gale Thrust',
    cost: [C],
    damage: 60,
    text: 'If this Pokémon moved from your Bench to the Active Spot this turn, this attack does 170 more damage.'
  }, {
    name: 'Spiky Hopper',
    cost: [C, C],
    damage: 160,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokemon.'
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';
  public name: string = 'Mega Lopunny ex';
  public fullName: string = 'Mega Lopunny ex M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (MOVED_TO_ACTIVE_THIS_TURN(effect.player, this)) {
        effect.damage += 170;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 160);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    return state;
  }
}
