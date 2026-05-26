import { KNOWN_ATTACK_EFFECT_MARKERS, KNOWN_POKEMON_SCOPED_PLAYER_MARKERS } from '../prefabs/clear-effect-markers';
export class Marker {
    constructor() {
        this.markers = [];
    }
    hasMarker(name, source) {
        if (source === undefined) {
            return this.markers.some(c => c.name === name);
        }
        return this.markers.some(c => c.source === source && c.name === name);
    }
    removeMarker(name, source) {
        if (!this.hasMarker(name, source)) {
            return;
        }
        if (source === undefined) {
            this.markers = this.markers.filter(c => c.name !== name);
            return;
        }
        this.markers = this.markers.filter(c => c.source !== source || c.name !== name);
    }
    addMarker(name, source, sourceType, targetScope) {
        if (this.hasMarker(name, source)) {
            return;
        }
        this.markers.push({ name, source, sourceType, targetScope });
    }
    addMarkerToState(name) {
        if (this.hasMarker(name)) {
            return;
        }
        this.markers.push({ name });
    }
    /**
     * Remove all markers that were created by attacks.
     * Uses both the `sourceType` metadata (for migrated markers) and
     * the `KNOWN_ATTACK_EFFECT_MARKERS` whitelist (for unmigrated markers).
     */
    removeAttackEffects() {
        this.markers = this.markers.filter(m => {
            if (m.sourceType === 'attack')
                return false;
            if (KNOWN_ATTACK_EFFECT_MARKERS.has(m.name))
                return false;
            return true;
        });
    }
    /**
     * Remove player-level markers that are scoped to the active Pokemon.
     * Uses both the `targetScope` metadata (for migrated markers) and
     * the `KNOWN_POKEMON_SCOPED_PLAYER_MARKERS` whitelist (for unmigrated markers).
     * Does NOT remove player-scoped locks (item lock, tool lock, etc.).
     */
    removePokemonScopedMarkers() {
        this.markers = this.markers.filter(m => {
            if (m.targetScope === 'pokemon')
                return false;
            if (KNOWN_POKEMON_SCOPED_PLAYER_MARKERS.has(m.name))
                return false;
            return true;
        });
    }
    /** Remove all markers matching a given source type. */
    removeMarkersBySourceType(sourceType) {
        this.markers = this.markers.filter(m => m.sourceType !== sourceType);
    }
    /** Remove all markers matching a given target scope. */
    removeMarkersByTargetScope(targetScope) {
        this.markers = this.markers.filter(m => m.targetScope !== targetScope);
    }
    /** Return all markers matching a given source type. */
    getMarkersBySourceType(sourceType) {
        return this.markers.filter(m => m.sourceType === sourceType);
    }
}
