import { Archetype } from 'ptcg-server';

export class ArchetypeUtils {
  public static getArchetype(deckItems: any[], returnSingle: boolean = false): Archetype | Archetype[] {
    if (!deckItems) {
      return returnSingle ? Archetype.UNOWN : [Archetype.UNOWN];
    }

    // Only check for manual archetypes
    const foundArchetypes = new Set<Archetype>();
    let hasGardevoir = false;
    let hasClefairy = false;

    deckItems.forEach(item => {
      const cardName = item?.card?.name;
      if (cardName) {
        // Check for Gardevoir and Clefairy combination
        if (cardName.includes('Gardevoir')) {
          hasGardevoir = true;
        }
        if (cardName.includes('Clefairy')) {
          hasClefairy = true;
        }
      }
    });

    // If no manual archetypes found, return UNOWN
    return returnSingle ? Archetype.UNOWN : [Archetype.UNOWN];
  }
}
