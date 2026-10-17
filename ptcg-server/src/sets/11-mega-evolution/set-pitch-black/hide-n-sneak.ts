/**
 * Not a card!
 * Contains shared reduceEffect code and utility functions for all of the Hide 'n' Sneak mons.
 */

import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Player } from '../../../game/store/state/player';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import { Effect } from '../../../game/store/effects/effect';
import {
  AbstractAttackEffect,
  ApplyWeaknessEffect,
  DealDamageEffect,
  PutDamageEffect,
} from '../../../game/store/effects/attack-effects';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { StateUtils } from '../../../game/store/state-utils';
import { PREVENT_EFFECTS_OF_OPPONENTS_ABILITIES } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

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
 *       set-unbroken-bonds/stealthy-hood.ts (PREVENT_EFFECTS_OF_OPPONENTS_ABILITIES).
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

  // Ability half — Ref: set-unbroken-bonds/stealthy-hood.ts
  const hideNSneakPower = self.powers.find(
    (p) => p.powerType === PowerType.ABILITY && p.name === "Hide 'n' Sneak",
  );
  PREVENT_EFFECTS_OF_OPPONENTS_ABILITIES(state, effect, (target) => {
    if (target.getPokemonCard() !== self) {
      return false;
    }
    const owner = StateUtils.findOwner(state, target);
    if (!StateUtils.isPokemonInPlay(owner, self)) {
      return false;
    }
    if (IS_ABILITY_BLOCKED(store, state, owner, self, hideNSneakPower)) {
      return false;
    }
    return true;
  });

  return state;
}
