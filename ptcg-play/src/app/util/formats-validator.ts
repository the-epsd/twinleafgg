 import { Card, CardTag, EnergyType, Format, SuperType } from "ptcg-server"

export class FormatValidator {
  
  static getValidFormats(card: Card): Format[] {
    const formats = [Format.UNLIMITED];
    
    [
      Format.GLC, 
      Format.EXPANDED, 
      Format.STANDARD, 
      Format.RETRO
    ].forEach(format => {
      this.isValid(card, format) ? formats.push(format) : null;
    });
    
    return formats;
  }
  
  static isValid(card: Card, format: Format): boolean {    
    
    if (card.superType === SuperType.ENERGY && EnergyType.BASIC) {
      return true;
    }
    
    switch (format) {
      case Format.UNLIMITED:
        return true;
        
      case Format.STANDARD:
        return card.regulationMark === 'F' || 
               card.regulationMark === 'G' || 
               card.regulationMark === 'H';
               
      case Format.EXPANDED:
        var banList = BanLists[format];        
        var setDate = SetReleaseDates[card.set];
        return setDate >= new Date('Mon, 25 Apr 2011 00:00:00 GMT') && 
               !banList.includes(`${card.name} ${card.set} ${card.setNumber}`);
               
      case Format.GLC:
        var banList = BanLists[format];        
        var setDate = SetReleaseDates[card.set];
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
               card.set ==='PR';
    }
    
    if (banList.includes(`${card.name} ${card.set} ${card.setNumber}`)) {
      return false;
    }
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
    'Pokémon Research Lab UNM 205'
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
    'Unown LOT 91'
  ],
  [Format.RETRO]: [],
  [Format.UNLIMITED]: [],
  [Format.STANDARD]: []
}

export const SetReleaseDates: { [key: string]: Date } = {
  // BASE-GYM
  'BS': new Date('09-01-1999'),
  'JU': new Date('16-06-1999'),
  'FO': new Date('10-10-1999'),
  'TR': new Date('24-04-2000'),
  'G1': new Date('14-08-2000'),
  'G2': new Date('16-10-2000'),
  // NEO
  'N1': new Date('16-12-2000'),
  'N2': new Date('01-06-2001'),
  'N3': new Date('21-09-2001'),
  'N4': new Date('28-02-2002'),
  // LEGENDARY COLLECTION
  'LC': new Date('24-05-2002'),
  // E-CARD
  'EX': new Date('15-09-2002'),
  'AQ': new Date('15-01-2003'),
  'SK': new Date('12-05-2003'),
  // EX 
  'RS': new Date('18-07-2003'),
  'SS': new Date('18-09-2003'),
  'DR': new Date('24-11-2003'),
  'MA': new Date('15-03-2004'),
  'HL': new Date('14-06-2004'),
  'FL': new Date('30-08-2004'),
  'TRR': new Date('08-11-2004'),
  'DX': new Date('14-02-2005'),
  'EM': new Date('09-05-2005'),
  'UF': new Date('22-08-2005'),
  'DS': new Date('31-10-2005'),
  'LM': new Date('13-02-2006'),
  'HP': new Date('03-05-2006'),
  'CG': new Date('30-08-2006'),
  'DF': new Date('08-11-2006'),
  'PK': new Date('14-02-2007'),
  // DIAMOND & PEARL
  'DP': new Date('23-05-2007'),
  'MT': new Date('22-08-2007'),
  'SW': new Date('07-11-2007'),
  'GE': new Date('13-02-2008'),
  'MD': new Date('21-05-2008'),
  'LA': new Date('20-08-2008'),
  'SF': new Date('05-11-2008'),
  //PLATINUM
  'PL': new Date('11-02-2009'),
  'RR': new Date('16-05-2009'),
  'SV': new Date('19-08-2009'),
  'AR': new Date('04-11-2009'),
  // HG & SS
  'HS': new Date('10-02-2010'),
  'UL': new Date('12-05-2010'),
  'UD': new Date('18-08-2010'),
  'TM': new Date('03-11-2010'),
  // CALL OF LEGENDS
  'CL': new Date('09-02-2011'),
  // BLACK & WHITE
  'BLW': new Date('25-04-2011'),
  'EPO': new Date('31-08-2011'),
  'NVI': new Date('16-11-2011'),
  'NXD': new Date('08-02-2012'),
  'DEX': new Date('09-05-2012'),
  'DRX': new Date('15-08-2012'),
  'DRV': new Date('05-10-2012'),
  'BCR': new Date('07-11-2012'),
  'PLS': new Date('06-02-2013'),
  'PLF': new Date('08-05-2013'),
  'PLB': new Date('14-08-2013'),
  'LTR': new Date('06-11-2013'),
  // X & Y
  'KSS': new Date('08-11-2013'),
  'XY': new Date('05-02-2014'),
  'FLF': new Date('07-05-2014'),
  'FFI': new Date('13-08-2014'),
  'PHF': new Date('05-11-2014'),
  'PRC': new Date('04-02-2015'),
  'DCR': new Date('25-03-2015'),
  'ROS': new Date('06-05-2015'),
  'AOR': new Date('12-08-2015'),
  'BKT': new Date('04-11-2015'),
  'BKP': new Date('03-02-2016'),
  'GEN': new Date('22-02-2016'),
  'FCO': new Date('02-05-2016'),
  'STS': new Date('03-08-2016'),
  'EVO': new Date('02-11-2016'),
  // SUN & MOON
  'SUM': new Date('03-02-2017'),
  'GRI': new Date('05-05-2017'),
  'BUS': new Date('04-08-2017'),
  'SLG': new Date('06-10-2017'),
  'CIN': new Date('03-11-2017'),
  'UPR': new Date('02-02-2018'),
  'FLI': new Date('05-04-2018'),
  'CES': new Date('08-03-2018'),
  'DRM': new Date('09-07-2018'),
  'LOT': new Date('11-02-2018'),
  'TEU': new Date('02-01-2019'),
  'DET': new Date('29-03-2019'),
  'UNB': new Date('05-03-2019'),
  'UNM': new Date('08-02-2019'),
  'HIF': new Date('23-08-2019'),
  'CEC': new Date('11-01-2019'),
  // SWORD & SHIELD
  'SSH': new Date('07-02-2020'),
  'RCL': new Date('01-05-2020'),
  'DAA': new Date('14-08-2020'),
  'CPA': new Date('25-09-2020'),
  'VIV': new Date('13-11-2020'),
  'SHF': new Date('19-02-2021'),
  'BST': new Date('19-03-2021'),
  'CRE': new Date('18-06-2021'),
  'EVS': new Date('27-08-2021'),
  'CEL': new Date('08-10-2021'),
  'FST': new Date('12-11-2021'),
  'BRS': new Date('25-02-2022'),
  'ASR': new Date('27-05-2022'),
  'PGO': new Date('01-07-2022'),
  'LOR': new Date('09-09-2022'),
  'SIT': new Date('11-11-2022'),
  'CRZ': new Date('20-01-2023'),
  // SCARLET & VIOLET
  'SVI': new Date('31-03-2023'),
  'PAL': new Date('09-06-2023'),
  'OBF': new Date('11-08-2023'),
  'MEW': new Date('22-09-2023'),
  'PAR': new Date('03-11-2023'),
  'PAF': new Date('26-01-2024'),
  'TEF': new Date('22-03-2024')
} 