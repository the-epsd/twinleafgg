import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AFTER_ATTACK, COIN_FLIP_PROMPT, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../../game/store/prefabs/attack-effects';

export class Gengar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Haunter';
  public hp: number = 110;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D, value: 30 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Life Drain',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, put damage counters on the Defending Pokémon until it is 10 HP away from being Knocked Out.'
  },
  {
    name: 'Shadow Dance',
    cost: [P, P, C],
    damage: 0,
    text: 'Put 4 damage counters on your opponent\'s Pokémon in any way you like. Then, switch Gengar with 1 of your Benched Pokémon.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Gengar';
  public fullName: string = 'Gengar DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Life Drain
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          const opponent = StateUtils.getOpponent(state, player);
          const selectedTarget = opponent.active;
          const checkHpEffect = new CheckHpEffect(effect.player, selectedTarget);
          store.reduceEffect(state, checkHpEffect);
          const totalHp = checkHpEffect.hp;
          let damageAmount = totalHp - 10;
          const targetDamage = selectedTarget.damage;
          if (targetDamage > 0) {
            damageAmount = Math.max(0, damageAmount - targetDamage);
          }
          if (damageAmount > 0) {
            const damageEffect = new PutDamageEffect(effect, damageAmount);
            damageEffect.target = selectedTarget;
            store.reduceEffect(state, damageEffect);
          } else if (damageAmount <= 0) {
            const damageEffect = new PutDamageEffect(effect, 0);
            damageEffect.target = selectedTarget;
            store.reduceEffect(state, damageEffect);
          }
        }
      });
    }

    // Shadow Dance
    if (WAS_ATTACK_USED(effect, 1, this)) {
      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(4, store, state, effect);
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
    }

    return state;
  }
}
