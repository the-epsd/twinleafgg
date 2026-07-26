import { Player } from '../state/player';
import { PokemonCardList } from '../state/pokemon-card-list';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { TrainerCard } from '../card/trainer-card';
import { StadiumEffect } from '../effects/play-card-effects';

/** True while an outer StadiumEffect probe is in flight. */
let probingStadiumEffect = false;

/**
 * Checks if stadium effects done to the given Pokémon are being prevented
 * (e.g. by Lunatone's New Moon Ability).
 * @returns `true` if stadium effects on this Pokémon are blocked, `false` otherwise.
 */
export function IS_STADIUM_EFFECT_BLOCKED(
  store: StoreLike,
  state: State,
  player: Player,
  target: PokemonCardList,
  stadium?: TrainerCard,
): boolean {
  // Nested probe (e.g. Silent Lab → IS_STADIUM_EFFECT_BLOCKED → Lunatone →
  // IS_ABILITY_BLOCKED → Silent Lab → IS_STADIUM_EFFECT_BLOCKED again).
  // New Moon takes priority over stadium ability locks: re-dispatch with
  // skipAbilityLockCheck so Lunatone can throw without Silent Lab shutting it off.
  // Non-stadium locks (Garbotoxin) are still enforced on the outer probe.
  if (probingStadiumEffect) {
    try {
      const nested = new StadiumEffect(player, target, stadium);
      nested.skipAbilityLockCheck = true;
      store.reduceEffect(state, nested);
    } catch {
      return true;
    }
    return false;
  }

  probingStadiumEffect = true;
  try {
    const stub = new StadiumEffect(player, target, stadium);
    store.reduceEffect(state, stub);
  } catch {
    return true;
  } finally {
    probingStadiumEffect = false;
  }
  return false;
}
