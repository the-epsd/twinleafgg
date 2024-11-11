import { Archetype } from 'ptcg-server';

export class ArchetypeUtils {
  public static getArchetype(deckItems: any[]): Archetype {
    const archetypeCombinations = [
      { archetype: Archetype.CHARIZARD, cards: ['Charizard ex', 'Pidgeot ex'] },
      { archetype: Archetype.CHARIZARD, cards: ['Charizard', 'Leon'] },
    ];

    const archetypeMapping: { [key: string]: Archetype } = {
      'Arceus VSTAR': Archetype.ARCEUS,
      'Charizard ex': Archetype.CHARIZARD,
      'Pidgeot ex': Archetype.PIDGEOT,
      'Miraidon ex': Archetype.MIRAIDON,
      'Pikachu ex': Archetype.PIKACHU,
      'Raging Bolt ex': Archetype.RAGING_BOLT,
      'Giratina VSTAR': Archetype.GIRATINA,
      'Origin Forme Palkia VSTAR': Archetype.PALKIA_ORIGIN,
      'Comfey': Archetype.COMFEY,
      'Iron Thorns ex': Archetype.IRON_THORNS,
      'Terapagos ex': Archetype.TERAPAGOS,
      'Regidrago': Archetype.REGIDRAGO,
      'Snorlax': Archetype.SNORLAX,
      'Gardevoir ex': Archetype.GARDEVOIR,
      'Roaring Moon ex': Archetype.ROARING_MOON,
      'Lugia VSTAR': Archetype.LUGIA,
      'Ceruledge ex': Archetype.CERULEDGE,
      'Dragapult ex': Archetype.DRAGAPULT,
    };

    for (const combination of archetypeCombinations) {
      if (combination.cards.every(card =>
        deckItems.some(item => item?.card?.fullName?.includes(card))
      )) {
        return combination.archetype;
      }
    }

    const typeCount: { [key in Archetype]?: number } = {};
    let maxCount = 0;
    let primaryArchetype = Archetype.UNOWN;

    for (const item of deckItems) {
      if (item?.card?.fullName) {
        const cardName = item.card.fullName.split(' ').slice(0, 2).join(' ');
        if (archetypeMapping[cardName]) {
          const cardType = archetypeMapping[cardName];
          typeCount[cardType] = (typeCount[cardType] || 0) + (item.card.count || 1);
          if (typeCount[cardType] > maxCount) {
            maxCount = typeCount[cardType];
            primaryArchetype = cardType;
          }
        }
      }
    }
    return primaryArchetype;
  }
}
