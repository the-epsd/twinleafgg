import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class GrassEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.GRASS];

  public set: string = 'EM';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '101';

  public name = 'Grass Energy';

  public fullName = 'Grass Energy (EM 101)';
  public legacyFullName = 'Grass Energy EM';

}

export class FireEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FIRE];

  public set: string = 'EM';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '102';

  public name = 'Fire Energy';

  public fullName = 'Fire Energy (EM 102)';
  public legacyFullName = 'Fire Energy EM';

}

export class WaterEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.WATER];

  public set: string = 'EM';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '103';

  public name = 'Water Energy';

  public fullName = 'Water Energy (EM 103)';
  public legacyFullName = 'Water Energy EM';

}

export class LightningEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.LIGHTNING];

  public set: string = 'EM';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '104';

  public name = 'Lightning Energy';

  public fullName = 'Lightning Energy (EM 104)';
  public legacyFullName = 'Lightning Energy EM';

}

export class PsychicEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.PSYCHIC];

  public set: string = 'EM';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '105';

  public name = 'Psychic Energy';

  public fullName = 'Psychic Energy (EM 105)';
  public legacyFullName = 'Psychic Energy EM';

}

export class FightingEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FIGHTING];

  public set: string = 'EM';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '106';

  public name = 'Fighting Energy';

  public fullName = 'Fighting Energy (EM 106)';
  public legacyFullName = 'Fighting Energy EM';

}