import { Attack } from '../card/pokemon-types';
import { PokemonCard } from '../card/pokemon-card';

/** Pending damage counter placement when Energy is attached from hand to the Defending Pokémon. */
export interface PendingEnergyAttachDamageCounters {
  /** Total HP to place as damage counters (e.g. 80 for 8 counters). */
  damage: number;
  attack: Attack;
  sourceCard: PokemonCard;
  attackerPlayerId: number;
}

/**
 * Consequences when Energy is attached from hand to this Pokémon during the
 * opponent's next turn (Boo-Hoo / Dreaming Tone / Lazy Howl).
 * Denial of attachment uses {@link PokemonCardList.cannotAttachEnergyFromHandNextTurn}.
 */
export interface PendingEnergyAttachFromHandConsequence {
  asleep?: boolean;
  endTurn?: boolean;
}
