import { PokemonCard } from '../card/pokemon-card';
import { State } from '../..';
import { Effect } from '../effects/effect';
import { AttackEffect, KnockOutEffect } from '../effects/game-effects';
/**
 * These prefabs are for "boolean" card effects. Boolean card effects oftentimes start with
 * an "if"; the function names here omit the "if" as they return booleans, and almost always
 * belong inside an if statement.
 */
/**
 *
 * @param effect
 * @param state
 * @returns
 */
export declare function YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK(effect: Effect, state: State): effect is KnockOutEffect;
export declare function THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect: AttackEffect, user: PokemonCard): boolean;
