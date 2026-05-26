import { Card } from '../card/card';
/** What kind of game mechanic created this marker. */
export declare type MarkerSourceType = 'attack' | 'ability' | 'trainer' | 'energy' | 'stadium';
/** What entity this marker functionally affects. */
export declare type MarkerTargetScope = 'pokemon' | 'player';
export interface MarkerItem {
    name: string;
    source?: Card;
    /** What kind of effect created this marker (attack, ability, trainer, etc.). */
    sourceType?: MarkerSourceType;
    /** Whether this marker targets a specific Pokemon or the player's actions broadly. */
    targetScope?: MarkerTargetScope;
}
export declare class Marker {
    markers: MarkerItem[];
    hasMarker(name: string, source?: Card): boolean;
    removeMarker(name: string, source?: Card): void;
    addMarker(name: string, source: Card, sourceType?: MarkerSourceType, targetScope?: MarkerTargetScope): void;
    addMarkerToState(name: string): void;
    /**
     * Remove all markers that were created by attacks.
     * Uses both the `sourceType` metadata (for migrated markers) and
     * the `KNOWN_ATTACK_EFFECT_MARKERS` whitelist (for unmigrated markers).
     */
    removeAttackEffects(): void;
    /**
     * Remove player-level markers that are scoped to the active Pokemon.
     * Uses both the `targetScope` metadata (for migrated markers) and
     * the `KNOWN_POKEMON_SCOPED_PLAYER_MARKERS` whitelist (for unmigrated markers).
     * Does NOT remove player-scoped locks (item lock, tool lock, etc.).
     */
    removePokemonScopedMarkers(): void;
    /** Remove all markers matching a given source type. */
    removeMarkersBySourceType(sourceType: MarkerSourceType): void;
    /** Remove all markers matching a given target scope. */
    removeMarkersByTargetScope(targetScope: MarkerTargetScope): void;
    /** Return all markers matching a given source type. */
    getMarkersBySourceType(sourceType: MarkerSourceType): MarkerItem[];
}
