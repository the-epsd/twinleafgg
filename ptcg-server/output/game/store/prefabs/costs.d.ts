import { State } from '../..';
import { AttackEffect } from '../effects/game-effects';
import { StoreLike } from '../..';
import { CardType } from '../card/card-types';
/**
 * These prefabs are for "costs" that effects/attacks must pay.
 */
/**
 *
 * @param state
 * @param effect
 * @param store
 * @param type
 * @param amount
 * @returns
 */
export declare function DISCARD_X_ENERGY_FROM_THIS_POKEMON(state: State, effect: AttackEffect, store: StoreLike, type: CardType, amount: number): State;
