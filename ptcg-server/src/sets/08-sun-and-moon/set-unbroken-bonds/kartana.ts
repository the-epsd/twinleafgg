import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Kartana extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 70;
  public weakness = [{ type: R }];

  public attacks = [{
    name: 'Big Cut',
    cost: [G],
    damage: 10,
    text: 'If you have exactly 4 Prize cards remaining, this attack does 120 more damage.'
  }, {
    name: 'False Swipe',
    cost: [G, C, C],
    damage: 0,
    text: ' Flip a coin. If heads, put damage counters on your opponent\'s Active Pokémon until its remaining HP is 10. '
  }];

  public set: string = 'UNB';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kartana';
  public fullName: string = 'Kartana UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.getPrizeLeft() === 4) {
        effect.damage += 120;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result === true) {
          const checkHpEffect = new CheckHpEffect(effect.player, opponent.active);
          store.reduceEffect(state, checkHpEffect);

          const totalHp = checkHpEffect.hp;
          let damageAmount = totalHp - 10;

          // Adjust damage if the target already has damage
          const targetDamage = opponent.active.damage;
          if (targetDamage > 0) {
            damageAmount = Math.max(0, damageAmount - targetDamage);
          }

          if (damageAmount > 0) {
            const damageEffect = new PutDamageEffect(effect, damageAmount);
            damageEffect.target = opponent.active;
            store.reduceEffect(state, damageEffect);
          } else if (damageAmount <= 0) {
            const damageEffect = new PutDamageEffect(effect, 0);
            damageEffect.target = opponent.active;
            store.reduceEffect(state, damageEffect);
          }
        }
      });
    }

    return state;
  }
}