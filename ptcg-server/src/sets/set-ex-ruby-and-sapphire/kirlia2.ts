import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
export class Kirlia2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Ralts';
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Dazzle Dance',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, each Defending Pokémon is now Confused.'
  },
  {
    name: 'Life Drain',
    cost: [P],
    damage: 0,
    text: 'Flip a coin. If heads, put damage counters on the Defending Pokémon until it is 10 HP away from being Knocked Out.'
  }];

  public set: string = 'RS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Kirlia';
  public fullName: string = 'Kirlia RS 35';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          const player = effect.player;
          const opponent = StateUtils.getOpponent(state, player);

          const selectedTarget = opponent.active;
          const checkHpEffect = new CheckHpEffect(effect.player, selectedTarget);
          store.reduceEffect(state, checkHpEffect);

          const totalHp = checkHpEffect.hp;
          let damageAmount = totalHp - 10;

          // Adjust damage if the target already has damage
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

    return state;
  }
}

