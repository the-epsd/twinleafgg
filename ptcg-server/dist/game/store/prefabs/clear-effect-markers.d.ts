/**
 * Exhaustive list of marker names known to be attack effects.
 * Used by `Marker.removeAttackEffects()` as a migration bridge:
 * markers matching EITHER `sourceType === 'attack'` OR name in this set
 * are removed. As individual cards get migrated to include `sourceType: 'attack'`,
 * they can eventually be removed from this whitelist.
 */
export declare const KNOWN_ATTACK_EFFECT_MARKERS: Set<string>;
/**
 * Player-level markers that are scoped to the active Pokemon — they should be
 * removed when a Pokemon leaves active (switching). These are distinct from
 * player-scoped locks (item lock, tool lock, etc.) which persist across switches.
 *
 * Used by `Marker.removePokemonScopedMarkers()` as a migration bridge alongside
 * the `targetScope === 'pokemon'` metadata check.
 */
export declare const KNOWN_POKEMON_SCOPED_PLAYER_MARKERS: Set<string>;
export declare const POKEMON_MARKERS: {
    ATTACK_USED_MARKER: string;
    ATTACK_USED_2_MARKER: string;
    CLEAR_KNOCKOUT_MARKER: string;
    CLEAR_KNOCKOUT_MARKER_2: string;
    KNOCKOUT_MARKER: string;
    PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN: string;
    CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN: string;
    PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN: string;
    CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN: string;
    OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER: string;
    DEFENDING_POKEMON_CANNOT_RETREAT_MARKER: string;
    PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER: string;
    CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER: string;
    DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER: string;
    CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER: string;
    DEFENDING_POKEMON_CANNOT_ATTACK_MARKER: string;
    DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER: string;
    CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER: string;
    PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: string;
    CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: string;
    PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER: string;
    OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER: string;
    PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER: string;
    CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER: string;
    UNRELENTING_ONSLAUGHT_MARKER: string;
    UNRELENTING_ONSLAUGHT_2_MARKER: string;
};
