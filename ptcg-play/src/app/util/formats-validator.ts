import { Card, CardTag, CardType, EnergyCard, EnergyType, Format, PokemonCard, SuperType } from "ptcg-server";

export class FormatValidator {

  static getValidFormatsForCardList(cards: Card[]): Format[] {

    if (!cards || cards.length === 0) {
      return [];
    }

    let formats = [];

    cards.filter(c => !!c && (c.superType !== SuperType.ENERGY || (<any>c).energyType === EnergyType.SPECIAL)).forEach(card => {
      formats.push(this.getValidFormats(card));
    });

    let formatList = formats.reduce((a, b) => a.filter(c => b.includes(c)))

    // Add Professor validation check here
    if (!cards) {
      return [];
    }

    const set = new Set(cards.filter(c => !!c).map(c => c.name));
    if ((set.has('Professor Sycamore') && set.has('Professor Juniper')) ||
      (set.has('Professor Juniper') && set.has('Professor\'s Research')) ||
      (set.has('Professor Sycamore') && set.has('Professor\'s Research')) ||
      (set.has('Lysandre') && set.has('Boss\'s Orders'))) {
      return formatList.filter(f =>
        f !== Format.GLC &&
        f !== Format.EXPANDED &&
        f !== Format.STANDARD &&
        f !== Format.UNLIMITED
      );
    }

    if ((set.has('Fairy Energy')) ||
      (set.has('Wonder Energy'))) {
      return formatList.filter(f =>
        f !== Format.STANDARD &&
        f !== Format.RETRO
      );
    }

    if ((set.has('Metal Energy')) ||
      (set.has('Darkness Energy'))) {
      return formatList.filter(f =>
        f !== Format.RETRO
      );
    }

    if (formatList.includes(Format.GLC)) {

      // check for singleton violation
      const nonBasicEnergyCards = cards.filter(c => c.superType !== SuperType.ENERGY && (<any>c).energyType !== EnergyType.BASIC);

      const set = new Set(nonBasicEnergyCards.map(c => c.name));

      if (set.size < nonBasicEnergyCards.length) {
        formatList = formatList.filter(f => f !== Format.GLC);
        return formatList;
      }

      // check for different type violation
      const pokemonCards = cards.filter(c => c.superType === SuperType.POKEMON);

      const pokemonSet = new Set(pokemonCards.map(c => (<PokemonCard>c).cardType));

      if (pokemonSet.size > 1) {
        formatList = formatList.filter(f => f !== Format.GLC);
        return formatList;
      }
    }
    return formatList
  }

  static getValidFormats(card: Card): Format[] {
    const formats = [Format.UNLIMITED];

    [
      Format.GLC,
      Format.EXPANDED,
      Format.STANDARD,
      Format.STANDARD_NIGHTLY,
      Format.RETRO
    ].forEach(format => {
      this.isValid(card, format) ? formats.push(format) : null;
    });

    return formats;
  }

  static isValid(card: Card, format: Format): boolean {

    if (card.superType === SuperType.ENERGY && (<any>card).energyType === EnergyType.BASIC) {
      return true;
    }

    switch (format) {
      case Format.UNLIMITED:
        return true;

      case Format.STANDARD:
        var banList = BanLists[format];
        return card.regulationMark === 'F' ||
          card.regulationMark === 'G' ||
          card.regulationMark === 'H'

      case Format.STANDARD_NIGHTLY:
        var banList = BanLists[format];
        return card.regulationMark === 'G' ||
          card.regulationMark === 'H' ||
          card.regulationMark === 'I';

      case Format.EXPANDED:
        var banList = BanLists[format];
        var setDate = SetReleaseDates[card.set];
        return setDate >= new Date('Mon, 25 Apr 2011 00:00:00 GMT') &&
          !banList.includes(`${card.name} ${card.set} ${card.setNumber}`);

      case Format.GLC:
        var banList = BanLists[format];
        var setDate = SetReleaseDates[card.set];
        // return setDate >= new Date('Mon, 25 Apr 2011 00:00:00 GMT') && setDate <= new Date() &&
        return setDate >= new Date('Mon, 25 Apr 2011 00:00:00 GMT') &&
          !banList.includes(`${card.name} ${card.set} ${card.setNumber}`) &&
          !card.tags.some(t => [
            CardTag.ACE_SPEC.toString(),
            CardTag.POKEMON_EX.toString(),
            CardTag.POKEMON_ex.toString(),
            CardTag.POKEMON_V.toString(),
            CardTag.POKEMON_VMAX.toString(),
            CardTag.POKEMON_VSTAR.toString(),
            CardTag.RADIANT.toString(),
            CardTag.POKEMON_GX.toString()
          ].includes(t));

      case Format.RETRO:
        return card.set === 'BS' ||
          card.set === 'JU' ||
          card.set === 'FO' ||
          card.set === 'PR';
    }

    if (banList.includes(`${card.name} ${card.set} ${card.setNumber}`)) {
      return false;
    }
    return false;
  }
}

export const BanLists: { [key: number]: string[] } = {
  [Format.GLC]: [
    'Lysandre\'s Trump Card PHF 99',
    'Lysandre\'s Trump Card PHF 118',
    'Oranguru UPR 114',
    'Forest of Giant Plants AOR 74',
    'Chip-Chip Ice Axe UNB 165',
    'Hiker CES 133',
    'Hiker HIF SV85',
    'Kyogre SHF 021',
    'Pokémon Research Lab UNM 205',
    'Raikou VIV 50',
    'Duskull CEC 83',
    'Marshadow SLG 45',
    'Marshadow SM 85'
  ],
  [Format.EXPANDED]: [
    'Archeops NVI 67',
    'Archeops DEX 110',
    'Chip-Chip Ice Axe UNB 165',
    'Delinquent BKP 98',
    'Delinquent BKP 98a',
    'Delinquent BKP 98b',
    'Flabébé FLI 83',
    'Forest of Giant Plants AOR 74',
    'Ghetsis PLF 101',
    'Ghetsis PLF 115',
    'Hex Maniac AOR 75',
    'Hex Maniac AOR 75a',
    'Island Challenge Amulet CEC 194',
    'Jesse & James HIF 58',
    'Jesse & James HIF 68',
    'Lt. Surge\'s Strategy UNB 178',
    'Lt. Surge\'s Strategy HIF 60',
    'Lysandre\'s Trump Card PHF 99',
    'Lysandre\'s Trump Card PHF 118',
    'Marshadow SHL 45',
    'Marshadow PR-SM SM85',
    'Milotic FLF 23',
    'Mismagius UNB 78',
    'Oranguru UPR 114',
    'Puzzle of Time BKP 109',
    'Red Card GEN 71',
    'Reset Stamp UNM 206',
    'Reset Stamp UNM 206a',
    'Reset Stamp UNM 253',
    'Sableye DEX 62',
    'Scoop Up Net RCL 165',
    'Scoop Up Net RCL 207',
    'Shaymin-EX ROS 77',
    'Shaymin-EX ROS 77a',
    'Shaymin-EX ROS 106',
    'Unown LOT 90',
    'Unown LOT 91',
    'Duskull CEC 83',
  ],
  [Format.RETRO]: [],
  [Format.UNLIMITED]: [],
  [Format.STANDARD]: [],
  [Format.STANDARD_NIGHTLY]: []
}

export const SetReleaseDates: { [key: string]: Date } = {
  'BS': new Date('1999-01-09'),
  'JU': new Date('1999-06-16'),
  'FO': new Date('1999-10-10'),
  'TR': new Date('2000-04-24'),
  'G1': new Date('2000-08-14'),
  'G2': new Date('2000-10-16'),
  // NEO
  'N1': new Date('2000-12-16'),
  'N2': new Date('2001-06-01'),
  'N3': new Date('2001-09-21'),
  'N4': new Date('2002-02-28'),
  // LEGENDARY COLLECTION
  'LC': new Date('2002-05-24'),
  // E-CARD
  'EX': new Date('2002-09-15'),
  'AQ': new Date('2003-01-15'),
  'SK': new Date('2003-05-12'),
  // EX 
  'RS': new Date('2003-07-18'),
  'SS': new Date('2003-09-18'),
  'DR': new Date('2003-11-24'),
  'MA': new Date('2004-03-15'),
  'HL': new Date('2004-06-14'),
  'FL': new Date('2004-08-30'),
  'TRR': new Date('2004-11-08'),
  'DX': new Date('2005-02-14'),
  'EM': new Date('2005-05-09'),
  'UF': new Date('2005-08-22'),
  'DS': new Date('2005-10-31'),
  'LM': new Date('2006-02-13'),
  'HP': new Date('2006-05-03'),
  'CG': new Date('2006-08-30'),
  'DF': new Date('2006-11-08'),
  'PK': new Date('2007-02-14'),
  // DIAMOND & PEARL
  'DP': new Date('2007-05-23'),
  'MT': new Date('2007-08-22'),
  'SW': new Date('2007-11-07'),
  'GE': new Date('2008-02-13'),
  'MD': new Date('2008-05-21'),
  'LA': new Date('2008-08-20'),
  'SF': new Date('2008-11-05'),
  //PLATINUM
  'PL': new Date('2009-02-11'),
  'RR': new Date('2009-05-16'),
  'SV': new Date('2009-08-19'),
  'AR': new Date('2009-11-04'),
  // HG & SS
  'HS': new Date('2010-02-10'),
  'UL': new Date('2010-05-12'),
  'UD': new Date('2010-08-18'),
  'TM': new Date('2010-11-03'),
  // CALL OF LEGENDS
  'CL': new Date('2011-02-09'),
  // BLACK & WHITE
  'BWP': new Date('2011-04-25'),
  'BLW': new Date('2011-04-25'),
  'EPO': new Date('2011-08-31'),
  'NVI': new Date('2011-11-16'),
  'NXD': new Date('2012-02-08'),
  'DEX': new Date('2012-05-09'),
  'DRX': new Date('2012-08-15'),
  'DRV': new Date('2012-10-05'),
  'BCR': new Date('2012-11-07'),
  'PLS': new Date('2013-02-06'),
  'PLF': new Date('2013-05-08'),
  'PLB': new Date('2013-08-14'),
  'LTR': new Date('2013-11-06'),
  // X & Y
  'KSS': new Date('2013-11-08'),
  'XY': new Date('2014-02-05'),
  'FLF': new Date('2014-05-07'),
  'FFI': new Date('2014-08-13'),
  'PHF': new Date('2014-11-05'),
  'PRC': new Date('2015-02-04'),
  'DCR': new Date('2015-03-25'),
  'ROS': new Date('2015-05-06'),
  'AOR': new Date('2015-08-12'),
  'BKT': new Date('2015-11-04'),
  'BKP': new Date('2016-02-03'),
  'GEN': new Date('2016-02-22'),
  'FCO': new Date('2016-05-02'),
  'STS': new Date('2016-08-03'),
  'EVO': new Date('2016-11-02'),
  'XYP': new Date('2016-03-19'),
  // SUN & MOON
  'SUM': new Date('2017-02-03'),
  'SMP': new Date('2017-02-03'),
  'SM10a': new Date('2017-02-03'),
  'GRI': new Date('2017-05-05'),
  'BUS': new Date('2017-08-04'),
  'SLG': new Date('2017-10-06'),
  'CIN': new Date('2017-11-03'),
  'UPR': new Date('2018-02-02'),
  'FLI': new Date('2018-04-05'),
  'CES': new Date('2018-03-08'),
  'DRM': new Date('2018-07-09'),
  'LOT': new Date('2018-11-02'),
  'TEU': new Date('2019-01-02'),
  'DET': new Date('2019-03-29'),
  'UNB': new Date('2019-03-05'),
  'UNM': new Date('2019-02-08'),
  'HIF': new Date('2019-08-23'),
  'CEC': new Date('2019-11-01'),
  // SWORD & SHIELD
  'SWSH': new Date('2020-02-07'),
  'SSH': new Date('2020-02-07'),
  'RCL': new Date('2020-05-01'),
  'DAA': new Date('2020-08-14'),
  'CPA': new Date('2020-09-25'),
  'VIV': new Date('2020-11-13'),
  'SHF': new Date('2021-02-19'),
  'BST': new Date('2021-03-19'),
  'CRE': new Date('2021-06-18'),
  'EVS': new Date('2021-08-27'),
  'CEL': new Date('2021-10-08'),
  'FST': new Date('2021-11-12'),
  'BRS': new Date('2022-02-25'),
  'ASR': new Date('2022-05-27'),
  'PGO': new Date('2022-07-01'),
  'LOR': new Date('2022-09-09'),
  'SIT': new Date('2022-11-11'),
  'CRZ': new Date('2023-01-20'),
  // SCARLET & VIOLET
  'SVP': new Date('2023-03-31'),
  'SVI': new Date('2023-03-31'),
  'PAL': new Date('2023-06-09'),
  'OBF': new Date('2023-08-11'),
  'MEW': new Date('2023-09-22'),
  'PAR': new Date('2023-11-03'),
  'PAF': new Date('2024-01-26'),
  'TEF': new Date('2024-03-22'),
  'TWM': new Date('2024-05-24'),
  'SV6a': new Date('2024-06-07'),
  'SV7': new Date('2024-07-19'),
  'SFA': new Date('2024-08-02'),
  'SCR': new Date('2024-09-13'),
  'SV7a': new Date('2024-09-13'),
  'SV8': new Date('2024-11-04'),
  'SSP': new Date('2024-11-04'),
  'SV9': new Date('2024-12-25'),
}