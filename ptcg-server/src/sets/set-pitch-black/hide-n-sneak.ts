import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Player } from '../../game/store/state/player';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import {
  AbstractAttackEffect,
  ApplyWeaknessEffect,
  DealDamageEffect,
  PutDamageEffect,
} from '../../game/store/effects/attack-effects';
import {
  PlaceDamageCountersEffect,
  PutDamageCountersEffect,
} from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { StateUtils } from '../../game/store/state-utils';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

/** Pokémon cards in discard whose Ability name is Hide 'n' Sneak (used by Sinistcha line / Spiritomb / Dhelmise). */
export function countHideNSneakPokemonInDiscard(player: Player): number {
  let count = 0;
  player.discard.cards.forEach((c) => {
    if (
      c instanceof PokemonCard &&
      c.powers?.some((p) => p.powerType === PowerType.ABILITY && p.name === "Hide 'n' Sneak")
    ) {
      count++;
    }
  });
  return count;
}

/**
 * Passive Ability: This Pokémon can't be affected by effects of attacks or Abilities from your opponent's Pokémon.
 * Refs: set-burning-shadows/alolan-ninetales.ts (AbstractAttackEffect — blocks attack-sourced status via preventDefault before attackReducer);
 *       set-lost-origin/enamorus-v.ts (AddSpecialConditionsPowerEffect — ability-sourced Special Conditions).
 */
export function reduceHideNSneak(
  store: StoreLike,
  state: State,
  effect: Effect,
  self: PokemonCard,
): State {
  if (effect instanceof AbstractAttackEffect && effect.target?.cards.includes(self)) {
    if (effect.target.getPokemonCard() !== self) {
      return state;
    }
    const owner = StateUtils.findOwner(state, effect.target);
    if (!StateUtils.isPokemonInPlay(owner, self)) {
      return state;
    }
    if (IS_ABILITY_BLOCKED(store, state, owner, self)) {
      return state;
    }
    if (effect.player === owner) {
      return state;
    }

    // Allow Weakness & Resistance
    if (effect instanceof ApplyWeaknessEffect) {
      return state;
    }
    // Allow damage
    if (effect instanceof PutDamageEffect) {
      return state;
    }
    // Allow damage
    if (effect instanceof DealDamageEffect) {
      return state;
    }

    effect.preventDefault = true;
    return state;
  }

  if (effect instanceof PlaceDamageCountersEffect) {
    const target = effect.target;
    if (!target.cards.includes(self) || target.getPokemonCard() !== self) {
      return state;
    }
    const owner = StateUtils.findOwner(state, target);
    if (!StateUtils.isPokemonInPlay(owner, self)) {
      return state;
    }
    if (IS_ABILITY_BLOCKED(store, state, owner, self)) {
      return state;
    }
    if (effect.player === owner) {
      return state;
    }
    if (effect.source === undefined) {
      return state;
    }
    const sourceSlot = StateUtils.findPokemonSlot(state, effect.source);
    if (!sourceSlot || StateUtils.findOwner(state, sourceSlot) !== effect.player) {
      return state;
    }
    effect.preventDefault = true;
    return state;
  }

  // Ability-sourced Special Conditions (gameReducer path — not a subclass of AbstractAttackEffect)
  if (effect instanceof AddSpecialConditionsPowerEffect) {
    const target = effect.target;
    if (!target.cards.includes(self) || target.getPokemonCard() !== self) {
      return state;
    }
    const owner = StateUtils.findOwner(state, target);
    if (!StateUtils.isPokemonInPlay(owner, self)) {
      return state;
    }
    if (IS_ABILITY_BLOCKED(store, state, owner, self)) {
      return state;
    }
    if (effect.player === owner) {
      return state;
    }
    if (!(effect.source instanceof PokemonCard)) {
      return state;
    }
    const sourceSlot = StateUtils.findPokemonSlot(state, effect.source);
    if (!sourceSlot || StateUtils.findOwner(state, sourceSlot) !== effect.player) {
      return state;
    }
    effect.preventDefault = true;
    return state;
  }

  if (effect instanceof PutDamageCountersEffect && effect.effectOfAbility.target) {
    const target = effect.effectOfAbility.target as PokemonCardList;
    if (!target.cards.includes(self) || target.getPokemonCard() !== self) {
      return state;
    }
    const owner = StateUtils.findOwner(state, target);
    if (!StateUtils.isPokemonInPlay(owner, self)) {
      return state;
    }
    if (IS_ABILITY_BLOCKED(store, state, owner, self)) {
      return state;
    }
    if (effect.player === owner) {
      return state;
    }
    effect.damage = 0;
    return state;
  }

  return state;
}
