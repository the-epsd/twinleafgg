import { State } from '../..';
import { AttackEffect, KnockOutEffect } from '../effects/game-effects';
import { StoreLike } from '../..';

export function THIS_ATTACK_DOES_X_MORE_DAMAGE(effect: AttackEffect, store: StoreLike, state: State, damage: number) {
  effect.damage += 100;
  return state;
}

export function TAKE_X_MORE_PRIZE_CARDS(effect: KnockOutEffect, state: State) {
  effect.prizeCount += 1;
  return state;
}