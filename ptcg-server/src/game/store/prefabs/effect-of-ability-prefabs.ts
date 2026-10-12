/**
 * Prefabs for "effects of Abilities done to" a Pokémon — parallel to effect-of-attack-prefabs.
 *
 * Sources should emit concrete effects (e.g. PlaceDamageCountersEffect with source) and let
 * the engine probe EffectOfAbilityEffect. Blockers call PREVENT_EFFECTS_OF_OPPONENTS_ABILITIES.
 */

import { GameMessage } from '../../game-message';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { PokemonCard } from '../card/pokemon-card';
import { Power, PowerType } from '../card/pokemon-types';
import { AddSpecialConditionsPowerEffect } from '../effects/check-effects';
import { Effect } from '../effects/effect';
import {
  EffectOfAbilityEffect,
  PlaceDamageCountersEffect,
  PutDamageCountersEffect,
} from '../effects/game-effects';
import { ChoosePokemonPrompt } from '../prompts/choose-pokemon-prompt';
import { StateUtils } from '../state-utils';
import { Player } from '../state/player';
import { PokemonCardList } from '../state/pokemon-card-list';
import { State } from '../state/state';
import { StoreLike } from '../store-like';

export type ProtectedTarget =
  | PokemonCardList
  | ((target: PokemonCardList, effect: Effect) => boolean);

function resolveProtectedTarget(
  effect: Effect,
  protectedTarget: ProtectedTarget,
): PokemonCardList | undefined {
  const target = getEffectTarget(effect);
  if (!target) {
    return undefined;
  }
  if (typeof protectedTarget === 'function') {
    return protectedTarget(target, effect) ? target : undefined;
  }
  return target === protectedTarget ? target : undefined;
}

function getEffectTarget(effect: Effect): PokemonCardList | undefined {
  if (effect instanceof EffectOfAbilityEffect) {
    return effect.target;
  }
  if (effect instanceof PlaceDamageCountersEffect) {
    return effect.target;
  }
  if (effect instanceof PutDamageCountersEffect) {
    return effect.effectOfAbility.target;
  }
  if (effect instanceof AddSpecialConditionsPowerEffect) {
    return effect.target;
  }
  return undefined;
}

/**
 * True when `effect` is an opponent's Ability effect done to `protectedList`.
 */
export function IS_EFFECT_OF_OPPONENTS_ABILITY_DONE_TO(
  state: State,
  effect: Effect,
  protectedList: PokemonCardList,
): boolean {
  const target = getEffectTarget(effect);
  if (!target || target !== protectedList) {
    return false;
  }

  let targetOwner: Player;
  try {
    targetOwner = StateUtils.findOwner(state, target);
  } catch {
    return false;
  }

  if (effect instanceof EffectOfAbilityEffect) {
    return effect.player === StateUtils.getOpponent(state, targetOwner);
  }

  if (effect instanceof PlaceDamageCountersEffect) {
    if (effect.player === targetOwner) {
      return false;
    }
    if (!(effect.source instanceof PokemonCard)) {
      return false;
    }
    const sourceSlot = StateUtils.findPokemonSlot(state, effect.source);
    if (!sourceSlot || StateUtils.findOwner(state, sourceSlot) !== effect.player) {
      return false;
    }
    return true;
  }

  if (effect instanceof PutDamageCountersEffect) {
    return effect.player === StateUtils.getOpponent(state, targetOwner);
  }

  // Ability-sourced Special Conditions use the Vileplume pattern:
  // effect.player = ability owner, source = ability Pokemon, target = affected list.
  // Attack-sourced ADD_*_TO_PLAYER_ACTIVE uses effect.player = target owner and is not blocked.
  if (effect instanceof AddSpecialConditionsPowerEffect) {
    if (!(effect.source instanceof PokemonCard)) {
      return false;
    }
    const sourceSlot = StateUtils.findPokemonSlot(state, effect.source);
    if (!sourceSlot) {
      return false;
    }
    const sourceOwner = StateUtils.findOwner(state, sourceSlot);
    return (
      effect.player === sourceOwner &&
      sourceOwner === StateUtils.getOpponent(state, targetOwner)
    );
  }

  return false;
}

/**
 * Prevent opponent Ability effects done to the protected target(s).
 * Returns true if the effect was prevented.
 *
 * - EffectOfAbilityEffect → clears `target`
 * - PlaceDamageCountersEffect → `preventDefault`
 * - PutDamageCountersEffect → zeroes damage / clears nested target
 * - AddSpecialConditionsPowerEffect → `preventDefault`
 */
export function PREVENT_EFFECTS_OF_OPPONENTS_ABILITIES(
  state: State,
  effect: Effect,
  protectedTarget: ProtectedTarget,
): boolean {
  const matched = resolveProtectedTarget(effect, protectedTarget);
  if (!matched || !IS_EFFECT_OF_OPPONENTS_ABILITY_DONE_TO(state, effect, matched)) {
    return false;
  }

  // Stealthy Hood / Hide 'n' Sneak: "Abilities" includes Poké-Bodies, Poké-Powers,
  // and Pokémon Powers (older wording for the same rules category).
  if (
    effect instanceof EffectOfAbilityEffect &&
    (
      effect.power.powerType === PowerType.ABILITY ||
      effect.power.powerType === PowerType.POKEBODY ||
      effect.power.powerType === PowerType.POKEPOWER ||
      effect.power.powerType === PowerType.POKEMON_POWER
    )
  ) {
    effect.target = undefined;
    return true;
  }

  if (effect instanceof PlaceDamageCountersEffect) {
    effect.preventDefault = true;
    return true;
  }

  if (effect instanceof PutDamageCountersEffect) {
    effect.damage = 0;
    effect.effectOfAbility.target = undefined;
    effect.preventDefault = true;
    return true;
  }

  if (effect instanceof AddSpecialConditionsPowerEffect) {
    effect.preventDefault = true;
    return true;
  }

  return false;
}

/**
 * Probe whether an Ability can apply its effect to `target`.
 * Returns false if a blocker cleared the probe target.
 */
export function CAN_APPLY_ABILITY_TO_TARGET(
  store: StoreLike,
  state: State,
  abilityOwner: Player,
  power: Power,
  card: PokemonCard,
  target: PokemonCardList,
): boolean {
  const canApplyAbility = new EffectOfAbilityEffect(abilityOwner, power, card, target);
  store.reduceEffect(state, canApplyAbility);
  return !!canApplyAbility.target;
}

export interface GustOpponentBenchedPokemonFromAbilityOptions {
  allowCancel?: boolean;
  blocked?: CardTarget[];
  onSwitched?: (target: PokemonCardList) => void;
}

/**
 * Ability-sourced gust: choose an opponent's Benched Pokémon, probe
 * EffectOfAbilityEffect (Stealthy Hood / Hide 'n' Sneak), then switch if allowed.
 *
 * Do not use for attacks (GustOpponentBenchEffect) or trainers (plain SWITCH_IN…).
 */
export function GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(
  store: StoreLike,
  state: State,
  player: Player,
  power: Power,
  card: PokemonCard,
  options: GustOpponentBenchedPokemonFromAbilityOptions = {},
): State {
  const { allowCancel = false, blocked = [], onSwitched } = options;
  const opponent = StateUtils.getOpponent(state, player);
  if (!opponent.bench.some((bench) => bench.cards.length > 0)) {
    return state;
  }

  return store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      PlayerType.TOP_PLAYER,
      [SlotType.BENCH],
      { min: 1, max: 1, allowCancel, blocked },
    ),
    (selected) => {
      if (!selected || selected.length === 0) {
        return;
      }
      const target = selected[0];
      if (!CAN_APPLY_ABILITY_TO_TARGET(store, state, player, power, card, target)) {
        return;
      }
      opponent.switchPokemon(target, store, state);
      if (onSwitched !== undefined) {
        onSwitched(target);
      }
    },
  );
}
