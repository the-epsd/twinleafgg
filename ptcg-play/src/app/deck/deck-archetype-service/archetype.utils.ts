import { Archetype } from 'ptcg-server';

export class ArchetypeUtils {
  public static getArchetype(deckItems: any[]): Archetype {
    const archetypeCombinations = [
      { archetype: Archetype.CHARIZARD, cards: ['Charizard ex', 'Pidgeot ex'] },
      { archetype: Archetype.CHARIZARD, cards: ['Charizard', 'Leon'] },
      { archetype: Archetype.PIKACHU, cards: ['Teal Mask Ogerpon ex', 'Lillie\'s Clefairy ex', 'Pikachu ex', 'Terapagos ex'] },
      { archetype: Archetype.MIRAIDON, cards: ['Miraidon ex', 'Raikou V'] },
      { archetype: Archetype.LUGIA, cards: ['Lugia VSTAR'] },
      { archetype: Archetype.ROARING_MOON, cards: ['Roaring Moon ex', 'Roaring Moon'] },
      { archetype: Archetype.ROARING_MOON, cards: ['Roaring Moon', 'Flutter Mane'] },
      { archetype: Archetype.HYDREIGON, cards: ['Hydreigon ex'] },
      { archetype: Archetype.ARCHALUDON, cards: ['Archaludon ex'] },
      { archetype: Archetype.KLAWF, cards: ['Klawf'] },
      { archetype: Archetype.TERAPAGOS, cards: ['Terapagos ex'] },
      { archetype: Archetype.TERAPAGOS, cards: ['Terapagos ex', 'Klawf'] },
      { archetype: Archetype.GOUGING_FIRE, cards: ['Gouging Fire ex'] },
      { archetype: Archetype.GHOLDENGO, cards: ['Gholdengo ex', 'Energy Search Pro'] },
      { archetype: Archetype.IRON_CROWN, cards: ['Iron Crown ex', 'Iron Hands ex'] },
      { archetype: Archetype.FERALIGATR, cards: ['Feraligatr ex'] },
      { archetype: Archetype.BLISSEY, cards: ['Blissey ex'] },
      { archetype: Archetype.MILOTIC, cards: ['Milotic ex'] },
      { archetype: Archetype.ZOROARK, cards: ['N\'s Zoroark ex'] },
      { archetype: Archetype.BELLIBOLT, cards: ['Iono\'s Bellibolt ex'] },
      { archetype: Archetype.FLAREON, cards: ['Flareon ex', 'Noctowl ex'] },
      { archetype: Archetype.TYRANITAR, cards: ['Tyrantiar ex'] },
      { archetype: Archetype.SLOWKING, cards: ['Slowking', 'Kyurem'] },
      { archetype: Archetype.MAMOSWINE, cards: ['Mamoswine ex'] },
      { archetype: Archetype.CLEFAIRY, cards: ['Lillie\'s Clefairy ex', 'Lillie\'s Pearl'] },
      { archetype: Archetype.ZACIAN, cards: ['Zacian ex'] },
      { archetype: Archetype.FROSLASS, cards: ['Froslass ex'] },
      { archetype: Archetype.DIPPLIN, cards: ['Dipplin', 'Thwackey'] },
      { archetype: Archetype.GARCHOMP, cards: ['Garchomp ex'] },
      { archetype: Archetype.HOOH, cards: ['Ethan\'s Ho-Oh ex'] },
      { archetype: Archetype.MEGA_GARDEVOIR, cards: ['Mega Gardevoir ex', 'Gardevoir ex'] },
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
      'Regidrago VSTAR': Archetype.REGIDRAGO,
      'Snorlax': Archetype.SNORLAX,
      'Gardevoir ex': Archetype.GARDEVOIR,
      'Roaring Moon ex': Archetype.ROARING_MOON,
      'Roaring Moon': Archetype.ROARING_MOON,
      'Lugia VSTAR': Archetype.LUGIA,
      'Ceruledge ex': Archetype.CERULEDGE,
      'Dragapult ex': Archetype.DRAGAPULT,
      'Archaludon ex': Archetype.ARCHALUDON,
      'Klawf': Archetype.KLAWF,
      'Gouging Fire ex': Archetype.GOUGING_FIRE,
      'Gholdengo ex': Archetype.GHOLDENGO,
      'Iron Crown ex': Archetype.IRON_CROWN,
      'Feraligatr': Archetype.FERALIGATR,
      'Blissey ex': Archetype.BLISSEY,
      'Milotic ex': Archetype.MILOTIC,
      'Teal Mask Ogerpon ex': Archetype.TEAL_MASK_OGERPON,
      'N\'s Zoroark ex': Archetype.ZOROARK,
      'Iono\'s Bellibolt ex': Archetype.BELLIBOLT,
      'Flareon ex': Archetype.FLAREON,
      'Tyrantiar ex': Archetype.TYRANITAR,
      'Slowking': Archetype.SLOWKING,
      'Mamoswine ex': Archetype.MAMOSWINE,
      'Lillie\'s Clefairy ex': Archetype.CLEFAIRY,
      'Hop\'s Zacian ex': Archetype.ZACIAN,
      'Froslass': Archetype.FROSLASS,
      'Dipplin': Archetype.DIPPLIN,
      'Rotom VSTAR': Archetype.ROTOM,
      'Hydrapple ex': Archetype.HYDRAPPLE,
      'Garchomp ex': Archetype.GARCHOMP,
      'Cynthia\'s Garchomp ex': Archetype.GARCHOMP,
      'Ethan\'s Ho-oh ex': Archetype.HOOH,
      'Hydreigon ex': Archetype.HYDREIGON,
      'Mega Gardevoir ex': Archetype.MEGA_GARDEVOIR,
    };

    for (const combination of archetypeCombinations) {
      if (combination.cards.every(card =>
        deckItems.some(item => item?.card?.name?.includes(card))
      )) {
        return combination.archetype;
      }
    }

    const typeCount: { [key in Archetype]?: number } = {};
    let maxCount = 0;
    let primaryArchetype = Archetype.UNOWN;

    for (const item of deckItems) {
      if (item?.card?.name) {
        const cardName = item.card.name.split(' ').slice(0, 2).join(' ');
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
