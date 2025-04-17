export class SetCodeService {
  private static instance: SetCodeService;
  private setCodeMap: Map<string, string>;

  private constructor() {
    this.setCodeMap = new Map([
      // Base Set
      ['BS', 'base1'],

      // Jungle
      ['JU', 'base2'],

      // Fossil
      ['FO', 'base3'],

      // Base Set 2
      ['BS2', 'base4'],

      // Team Rocket
      ['TR', 'base5'],

      // Gym Heroes
      ['GH', 'gym1'],
      ['GH2', 'gym2'],

      // Neo Genesis
      ['NG', 'neo1'],
      ['NG2', 'neo2'],
      ['NG3', 'neo3'],
      ['NG4', 'neo4'],

      // Expedition
      ['EX', 'expedition'],
      ['EX2', 'aquapolis'],
      ['EX3', 'skyridge'],

      // Ruby & Sapphire
      ['RS', 'ruby-sapphire'],
      ['RS2', 'sandstorm'],
      ['RS3', 'dragon'],
      ['RS4', 'team-magma-vs-team-aqua'],
      ['RS5', 'hidden-legends'],
      ['RS6', 'firered-leafgreen'],
      ['RS7', 'deoxys'],
      ['RS8', 'emerald'],
      ['RS9', 'unseen-forces'],
      ['RS10', 'delta-species'],
      ['RS11', 'legend-maker'],
      ['RS12', 'holon-phantoms'],
      ['RS13', 'crystal-guardians'],
      ['RS14', 'dragon-frontiers'],
      ['RS15', 'power-keepers'],

      // Diamond & Pearl
      ['DP', 'diamond-pearl'],
      ['DP2', 'mysterious-treasures'],
      ['DP3', 'secret-wonders'],
      ['DP4', 'great-encounters'],
      ['DP5', 'majestic-dawn'],
      ['DP6', 'legends-awakened'],
      ['DP7', 'stormfront'],

      // Platinum
      ['PL', 'platinum'],
      ['PL2', 'rising-rivals'],
      ['PL3', 'supreme-victors'],
      ['PL4', 'arcues'],

      // HeartGold & SoulSilver
      ['HGSS', 'heartgold-soulsilver'],
      ['HGSS2', 'unleashed'],
      ['HGSS3', 'undaunted'],
      ['HGSS4', 'triumphant'],
      ['HGSS5', 'call-of-legends'],

      // Black & White
      ['BW', 'black-white'],
      ['BW2', 'emerging-powers'],
      ['BW3', 'noble-victories'],
      ['BW4', 'next-destinies'],
      ['BW5', 'dark-explorers'],
      ['BW6', 'dragons-exalted'],
      ['BW7', 'boundaries-crossed'],
      ['BW8', 'plasma-storm'],
      ['BW9', 'plasma-freeze'],
      ['BW10', 'plasma-blast'],
      ['BW11', 'legendary-treasures'],

      // XY
      ['XY', 'xy'],
      ['XY2', 'flashfire'],
      ['XY3', 'furious-fists'],
      ['XY4', 'phantom-forces'],
      ['XY5', 'primal-clash'],
      ['XY6', 'roaring-skies'],
      ['XY7', 'ancient-origins'],
      ['XY8', 'breakthrough'],
      ['XY9', 'breakpoint'],
      ['XY10', 'fates-collide'],
      ['XY11', 'steam-siege'],
      ['XY12', 'evolutions'],

      // Sun & Moon
      ['SM', 'sun-moon'],
      ['SM2', 'guardians-rising'],
      ['SM3', 'burning-shadows'],
      ['SM4', 'shining-legends'],
      ['SM5', 'crimson-invasion'],
      ['SM6', 'ultra-prism'],
      ['SM7', 'forbidden-light'],
      ['SM8', 'celestial-storm'],
      ['SM9', 'dragon-majesty'],
      ['SM10', 'lost-thunder'],
      ['SM11', 'team-up'],
      ['SM12', 'detective-pikachu'],
      ['SM13', 'unbroken-bonds'],
      ['SM14', 'unified-minds'],
      ['SM15', 'hidden-fates'],
      ['SM16', 'cosmic-eclipse'],

      // Sword & Shield
      ['SWSH', 'sword-shield'],
      ['SWSH2', 'rebel-clash'],
      ['SWSH3', 'darkness-ablaze'],
      ['SWSH4', 'champions-path'],
      ['SWSH5', 'vivid-voltage'],
      ['SWSH6', 'shining-fates'],
      ['SWSH7', 'battle-styles'],
      ['SWSH8', 'chilling-reign'],
      ['SWSH9', 'evolving-skies'],
      ['SWSH10', 'celebrations'],
      ['SWSH11', 'fusion-strike'],
      ['SWSH12', 'brilliant-stars'],
      ['SWSH13', 'astral-radiance'],
      ['SWSH14', 'lost-origin'],
      ['SWSH15', 'silver-tempest'],
      ['SWSH16', 'crown-zenith'],

      // Scarlet & Violet
      ['SVI', 'sv1'],
      ['PAL', 'sv2'],
      ['OBF', 'sv3'],
      ['MEW', 'sv3pt5'],
      ['PAR', 'sv4'],
      ['PAF', 'sv4pt5'],
      ['TEF', 'sv5'],
      ['TWM', 'sv6'],
      ['SFA', 'sv6pt5'],
      ['SCR', 'sv7'],
      ['SSP', 'sv8'],
      ['PRE', 'sv8pt5'],
      ['JTG', 'sv9'],
    ]);
  }

  public static getInstance(): SetCodeService {
    if (!SetCodeService.instance) {
      SetCodeService.instance = new SetCodeService();
    }
    return SetCodeService.instance;
  }

  public convertSetCode(ourSetCode: string): string {
    return this.setCodeMap.get(ourSetCode) || ourSetCode;
  }
}

export const setCodeService = SetCodeService.getInstance(); 