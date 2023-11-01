import { State } from '../..';
import { AttackEffect, KnockOutEffect } from '../effects/game-effects';
import { StoreLike } from '../..';
export declare function THIS_ATTACK_DOES_X_MORE_DAMAGE(effect: AttackEffect, store: StoreLike, state: State, damage: number): State;
export declare function TAKE_X_MORE_PRIZE_CARDS(effect: KnockOutEffect, state: State): State;
