import { Injectable } from '@angular/core';
import { Archetype } from 'ptcg-server';
import { DeckItem } from '../deck-card/deck-card.interface';
import { ARCHETYPE_DATA } from './archetype-data';
import {
  ArchetypeDefinition,
  ArchetypeCardRequirement,
  ArchetypeMatch,
  ArchetypeVariant,
  DetectionResult
} from './archetype-detection.interfaces';

interface CardInfo {
  count: number;
  sets: Set<string>;
}

@Injectable({
  providedIn: 'root'
})
export class ArchetypeDetectionService {
  private archetypeDefinitions: ArchetypeDefinition[] = ARCHETYPE_DATA;

  /**
   * Detect archetypes from deck items
   */
  public detectArchetypes(deckItems: DeckItem[]): DetectionResult {
    if (!deckItems || deckItems.length === 0) {
      return { primary: null, secondary: null };
    }

    const cardMap = this.buildCardMap(deckItems);
    const matches = this.findAllMatches(cardMap);
    const ranked = this.rankMatches(matches);

    return this.selectBestMatches(ranked);
  }

  /**
   * Convert icon strings to Archetype enum values
   */
  public iconsToArchetypes(icons: string[]): Archetype[] {
    const result: Archetype[] = [];
    for (const icon of icons) {
      const archetype = this.iconToArchetype(icon);
      if (archetype) {
        result.push(archetype);
      }
    }
    return result.length > 0 ? result : [Archetype.UNOWN];
  }

  /**
   * Get suggested archetypes for a deck
   */
  public getSuggestedArchetypes(deckItems: DeckItem[]): [Archetype | null, Archetype | null] {
    const result = this.detectArchetypes(deckItems);

    if (!result.primary) {
      return [null, null];
    }

    const icons = this.iconsToArchetypes(result.primary.icons);
    const primary = icons[0] || null;

    // Use second icon from same match if available, otherwise use secondary match
    let secondary: Archetype | null = null;
    if (icons.length > 1) {
      secondary = icons[1];
    } else if (result.secondary) {
      secondary = this.iconsToArchetypes(result.secondary.icons)[0] || null;
    }

    return [primary, secondary];
  }

  private buildCardMap(deckItems: DeckItem[]): Map<string, CardInfo> {
    const map = new Map<string, CardInfo>();

    for (const item of deckItems) {
      if (!item.card) continue;

      const cardName = item.card.name;
      const setCode = item.card.set;

      const existing = map.get(cardName);
      if (existing) {
        existing.count += item.count;
        if (setCode) {
          existing.sets.add(setCode);
        }
      } else {
        const sets = new Set<string>();
        if (setCode) {
          sets.add(setCode);
        }
        map.set(cardName, { count: item.count, sets });
      }
    }

    return map;
  }

  private findAllMatches(cardMap: Map<string, CardInfo>): ArchetypeMatch[] {
    const matches: ArchetypeMatch[] = [];

    for (const definition of this.archetypeDefinitions) {
      const baseMatch = this.checkArchetypeMatch(definition, cardMap);
      if (!baseMatch) continue;

      // Check variants for more specific matches
      let bestMatch = baseMatch;
      for (const variant of definition.variants) {
        const variantMatch = this.checkVariantMatch(definition, variant, cardMap);
        if (variantMatch && variantMatch.matchScore > bestMatch.matchScore) {
          bestMatch = variantMatch;
        }
      }

      matches.push(bestMatch);
    }

    return matches;
  }

  private checkArchetypeMatch(
    definition: ArchetypeDefinition,
    cardMap: Map<string, CardInfo>
  ): ArchetypeMatch | null {
    let matchScore = 0;

    for (const requirement of definition.cards) {
      const result = this.checkCardRequirement(requirement, cardMap);
      if (!result.matches) {
        return null;
      }
      matchScore += result.matchedCount;
    }

    return {
      definition,
      icons: definition.icons,
      priority: definition.priority,
      matchScore
    };
  }

  private checkVariantMatch(
    definition: ArchetypeDefinition,
    variant: ArchetypeVariant,
    cardMap: Map<string, CardInfo>
  ): ArchetypeMatch | null {
    // First check base requirements
    let matchScore = 0;

    for (const requirement of definition.cards) {
      const result = this.checkCardRequirement(requirement, cardMap);
      if (!result.matches) {
        return null;
      }
      matchScore += result.matchedCount;
    }

    // Then check variant requirements
    for (const requirement of variant.cards) {
      const result = this.checkCardRequirement(requirement, cardMap);
      if (!result.matches) {
        return null;
      }
      matchScore += result.matchedCount;
    }

    // Variant icons: base icons + variant icon
    const icons = [...definition.icons];
    if (variant.icon && !icons.includes(variant.icon)) {
      icons.push(variant.icon);
    }

    return {
      definition,
      variant,
      icons,
      priority: definition.priority + 1, // Variants get priority boost
      matchScore
    };
  }

  private checkCardRequirement(
    requirement: ArchetypeCardRequirement,
    cardMap: Map<string, CardInfo>
  ): { matches: boolean; matchedCount: number } {
    const requiredCount = parseInt(requirement.count || '1', 10);

    // Find matching card (case-insensitive, partial match for names with suffixes)
    const normalizedReqName = this.normalizeCardName(requirement.name);

    for (const [cardName, info] of cardMap.entries()) {
      const normalizedCardName = this.normalizeCardName(cardName);

      if (normalizedCardName === normalizedReqName) {
        // Check count requirement
        if (info.count < requiredCount) {
          return { matches: false, matchedCount: 0 };
        }

        // Check set requirement if specified
        if (requirement.set && !info.sets.has(requirement.set)) {
          return { matches: false, matchedCount: 0 };
        }

        return { matches: true, matchedCount: info.count };
      }
    }

    return { matches: false, matchedCount: 0 };
  }

  private normalizeCardName(name: string): string {
    return name
      .toLowerCase()
      .trim();
  }

  private rankMatches(matches: ArchetypeMatch[]): ArchetypeMatch[] {
    return matches.sort((a, b) => {
      // Higher priority wins
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      // More cards matched wins
      return b.matchScore - a.matchScore;
    });
  }

  private selectBestMatches(ranked: ArchetypeMatch[]): DetectionResult {
    if (ranked.length === 0) {
      return { primary: null, secondary: null };
    }

    const primary = ranked[0];

    // Find secondary that doesn't overlap with primary icons
    let secondary: ArchetypeMatch | null = null;
    for (let i = 1; i < ranked.length; i++) {
      const candidate = ranked[i];
      const overlaps = candidate.icons.some(icon => primary.icons.includes(icon));
      if (!overlaps) {
        secondary = candidate;
        break;
      }
    }

    return { primary, secondary };
  }

  private iconToArchetype(icon: string): Archetype | null {
    // Convert icon to enum key format: "charizard" -> "CHARIZARD", "chien-pao" -> "CHIEN_PAO"
    const enumKey = icon.toUpperCase().replace(/-/g, '_');

    // Check if this key exists in Archetype enum
    if (enumKey in Archetype) {
      return (Archetype as any)[enumKey] as Archetype;
    }

    return null;
  }
}
