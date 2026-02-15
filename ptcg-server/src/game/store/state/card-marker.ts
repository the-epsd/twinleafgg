import { Card } from '../card/card';
import { KNOWN_ATTACK_EFFECT_MARKERS, KNOWN_POKEMON_SCOPED_PLAYER_MARKERS } from '../prefabs/clear-effect-markers';

/** What kind of game mechanic created this marker. */
export type MarkerSourceType = 'attack' | 'ability' | 'trainer' | 'energy' | 'stadium';

/** What entity this marker functionally affects. */
export type MarkerTargetScope = 'pokemon' | 'player';

export interface MarkerItem {
  name: string;
  source?: Card;
  /** What kind of effect created this marker (attack, ability, trainer, etc.). */
  sourceType?: MarkerSourceType;
  /** Whether this marker targets a specific Pokemon or the player's actions broadly. */
  targetScope?: MarkerTargetScope;
}

export class Marker {

  public markers: MarkerItem[] = [];

  hasMarker(name: string, source?: Card) {
    if (source === undefined) {
      return this.markers.some(c => c.name === name);
    }
    return this.markers.some(c => c.source === source && c.name === name);
  }

  removeMarker(name: string, source?: Card) {
    if (!this.hasMarker(name, source)) {
      return;
    }
    if (source === undefined) {
      this.markers = this.markers.filter(c => c.name !== name);
      return;
    }
    this.markers = this.markers.filter(c => c.source !== source || c.name !== name);
  }

  addMarker(name: string, source: Card, sourceType?: MarkerSourceType, targetScope?: MarkerTargetScope) {
    if (this.hasMarker(name, source)) {
      return;
    }
    this.markers.push({ name, source, sourceType, targetScope });
  }

  addMarkerToState(name: string) {
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
  removeAttackEffects(): void {
    this.markers = this.markers.filter(m => {
      if (m.sourceType === 'attack') return false;
      if (KNOWN_ATTACK_EFFECT_MARKERS.has(m.name)) return false;
      return true;
    });
  }

  /**
   * Remove player-level markers that are scoped to the active Pokemon.
   * Uses both the `targetScope` metadata (for migrated markers) and
   * the `KNOWN_POKEMON_SCOPED_PLAYER_MARKERS` whitelist (for unmigrated markers).
   * Does NOT remove player-scoped locks (item lock, tool lock, etc.).
   */
  removePokemonScopedMarkers(): void {
    this.markers = this.markers.filter(m => {
      if (m.targetScope === 'pokemon') return false;
      if (KNOWN_POKEMON_SCOPED_PLAYER_MARKERS.has(m.name)) return false;
      return true;
    });
  }

  /** Remove all markers matching a given source type. */
  removeMarkersBySourceType(sourceType: MarkerSourceType): void {
    this.markers = this.markers.filter(m => m.sourceType !== sourceType);
  }

  /** Remove all markers matching a given target scope. */
  removeMarkersByTargetScope(targetScope: MarkerTargetScope): void {
    this.markers = this.markers.filter(m => m.targetScope !== targetScope);
  }

  /** Return all markers matching a given source type. */
  getMarkersBySourceType(sourceType: MarkerSourceType): MarkerItem[] {
    return this.markers.filter(m => m.sourceType === sourceType);
  }
}
