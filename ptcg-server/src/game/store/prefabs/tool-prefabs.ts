import { CardTag, CardType } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { TrainerCard } from '../card/trainer-card';
import { DealDamageEffect } from '../effects/attack-effects';
import { CheckHpEffect, CheckPokemonTypeEffect } from '../effects/check-effects';
import { Effect } from '../effects/effect';
import { PlayPokemonEffect } from '../effects/play-card-effects';
import { EndTurnEffect } from '../effects/game-phase-effects';
import { StateUtils } from '../state-utils';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { IS_TOOL_BLOCKED } from './prefabs';

// =============================================================================
// Tools & Mega
// =============================================================================

export interface ToolActiveDamageBonusOptions {
  damageBonus: number;
  sourcePokemonName?: string;
  sourceCardType?: CardType;
  sourceCardTag?: CardTag;
}

/**
 * Standard Tool damage hook for text like:
 * "If this card is attached to [condition], each of its attacks does [N] more damage
 * to the Active Pokemon (before applying Weakness and Resistance)."
 */
export function TOOL_ACTIVE_DAMAGE_BONUS(
  store: StoreLike,
  state: State,
  effect: Effect,
  tool: TrainerCard,
  options: ToolActiveDamageBonusOptions,
): void {
  if (!(effect instanceof DealDamageEffect) || !effect.source.tools.includes(tool)) {
    return;
  }

  if (IS_TOOL_BLOCKED(store, state, effect.player, tool)) {
    return;
  }

  const sourcePokemon = effect.source.getPokemonCard();
  if (sourcePokemon === undefined) {
    return;
  }

  if (options.sourcePokemonName !== undefined && sourcePokemon.name !== options.sourcePokemonName) {
    return;
  }

  if (options.sourceCardTag !== undefined && !sourcePokemon.tags.includes(options.sourceCardTag)) {
    return;
  }

  if (options.sourceCardType !== undefined) {
    const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.source);
    store.reduceEffect(state, checkPokemonTypeEffect);
    if (!checkPokemonTypeEffect.cardTypes.includes(options.sourceCardType)) {
      return;
    }
  }

  const opponent = StateUtils.getOpponent(state, effect.player);
  if (effect.target !== opponent.active || effect.damage <= 0) {
    return;
  }

  effect.damage += options.damageBonus;
}

export interface ToolSetHpIfOptions {
  hp: number;
  sourcePokemonName?: string;
  sourceCardType?: CardType;
  sourceCardTag?: CardTag;
}

/**
 * Standard Tool HP hook for text like:
 * "If this card is attached to [condition], its maximum HP is [N]."
 */
export function TOOL_SET_HP_IF(
  store: StoreLike,
  state: State,
  effect: Effect,
  tool: TrainerCard,
  options: ToolSetHpIfOptions,
): void {
  if (!(effect instanceof CheckHpEffect) || !effect.target.tools.includes(tool)) {
    return;
  }

  if (IS_TOOL_BLOCKED(store, state, effect.player, tool)) {
    return;
  }

  const sourcePokemon = effect.target.getPokemonCard();
  if (sourcePokemon === undefined) {
    return;
  }

  if (options.sourcePokemonName !== undefined && sourcePokemon.name !== options.sourcePokemonName) {
    return;
  }

  if (options.sourceCardTag !== undefined && !sourcePokemon.tags.includes(options.sourceCardTag)) {
    return;
  }

  if (options.sourceCardType !== undefined) {
    const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.target);
    store.reduceEffect(state, checkPokemonTypeEffect);
    if (!checkPokemonTypeEffect.cardTypes.includes(options.sourceCardType)) {
      return;
    }
  }

  effect.hp = options.hp;
}

/**
 * Spirit Link: skip the Mega Evolution end-turn rule when evolving into the named Mega Pokemon.
 * Call from the Spirit Link tool's reduceEffect with the target Mega's name.
 */
export function SPIRIT_LINK_SKIP_MEGA_EVOLUTION_END_TURN(
  store: StoreLike,
  state: State,
  effect: Effect,
  tool: TrainerCard,
  megaPokemonName: string,
): void {
  if (!(effect instanceof PlayPokemonEffect)
    || !effect.target.tools.includes(tool)
    || effect.pokemonCard.name !== megaPokemonName) {
    return;
  }

  if (IS_TOOL_BLOCKED(store, state, effect.player, tool)) {
    return;
  }

  effect.skipMegaEvolutionEndTurn = true;
}

/**
 * Mega Evolution Rule: end the turn when this Pokemon is played to evolve,
 * unless a Spirit Link set skipMegaEvolutionEndTurn on the PlayPokemonEffect.
 */
export function MEGA_EVOLUTION_END_TURN(
  store: StoreLike,
  state: State,
  effect: Effect,
  card: PokemonCard,
): void {
  if (effect instanceof PlayPokemonEffect && effect.pokemonCard === card
    && !effect.skipMegaEvolutionEndTurn) {
    store.reduceEffect(state, new EndTurnEffect(effect.player));
  }
}
