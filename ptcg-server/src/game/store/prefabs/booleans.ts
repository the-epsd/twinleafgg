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
export function YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK(effect: Effect, state: State): effect is KnockOutEffect{
  // TODO: this shouldn't work for attacks with damage counters, but I think it will
  return effect instanceof KnockOutEffect;
}

export function THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect: AttackEffect, user: PokemonCard){
  // TODO: Would like to check if Pokemon has damage without needing the effect
  const player = effect.player;
  const source = player.active;
  
  // Check if source Pokemon has damage
  const damage = source.damage;
  return damage > 0;
}