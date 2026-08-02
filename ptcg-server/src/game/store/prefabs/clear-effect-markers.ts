/**
 * Player-level markers that are scoped to the active Pokemon — they should be
 * removed when a Pokemon leaves active (switching). These are distinct from
 * player-scoped locks (item lock, tool lock, etc.) which persist across switches.
 *
 * Used by `Marker.removePokemonScopedMarkers()` as a migration bridge alongside
 * the `targetScope === 'pokemon'` metadata check.
 */
export const KNOWN_POKEMON_SCOPED_PLAYER_MARKERS = new Set([
  'KNOCKOUT_MARKER',
  'CLEAR_KNOCKOUT_MARKER',
]);
