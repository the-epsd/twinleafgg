import { Archetype } from 'ptcg-server';
import { ArchetypeDetectionService } from '../archetype-detection/archetype-detection.service';

// Singleton instance for static access
let detectionServiceInstance: ArchetypeDetectionService | null = null;

export class ArchetypeUtils {
  /**
   * Set the detection service instance for static access.
   * Should be called once during app initialization.
   */
  public static setDetectionService(service: ArchetypeDetectionService): void {
    detectionServiceInstance = service;
  }

  /**
   * Get archetypes for a deck based on its cards.
   * Uses the detection service if available, otherwise returns UNOWN.
   */
  public static getArchetype(deckItems: any[], returnSingle: boolean = false): Archetype | Archetype[] {
    if (!deckItems || deckItems.length === 0) {
      return returnSingle ? Archetype.UNOWN : [Archetype.UNOWN];
    }

    if (!detectionServiceInstance) {
      return returnSingle ? Archetype.UNOWN : [Archetype.UNOWN];
    }

    const [primary, secondary] = detectionServiceInstance.getSuggestedArchetypes(deckItems);

    if (returnSingle) {
      return primary || Archetype.UNOWN;
    }

    const result: Archetype[] = [];
    if (primary) result.push(primary);
    if (secondary) result.push(secondary);
    return result.length > 0 ? result : [Archetype.UNOWN];
  }
}
