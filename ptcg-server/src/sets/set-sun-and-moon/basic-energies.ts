import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class GrassEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.GRASS];
  public set: string = 'SUM';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'G';
  public name = 'Grass Energy';
  public fullName = 'Grass Energy SUM';
}

export class FireEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.FIRE];
  public set: string = 'SUM';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'R';
  public name = 'Fire Energy';
  public fullName = 'Fire Energy SUM';
}

export class WaterEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.WATER];
  public set: string = 'SUM';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'W';
  public name = 'Water Energy';
  public fullName = 'Water Energy SUM';
}

export class LightningEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.LIGHTNING];
  public set: string = 'SUM';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'L';
  public name = 'Lightning Energy';
  public fullName = 'Lightning Energy SUM';
}

export class PsychicEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.PSYCHIC];
  public set: string = 'SUM';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'P';
  public name = 'Psychic Energy';
  public fullName = 'Psychic Energy SUM';
}

export class FightingEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.FIGHTING];
  public set: string = 'SUM';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'F';
  public name = 'Fighting Energy';
  public fullName = 'Fighting Energy SUM';
}

export class DarknessEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.DARK];
  public set: string = 'SUM';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'D';
  public name = 'Darkness Energy';
  public fullName = 'Darkness Energy SUM';
}

export class MetalEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.METAL];
  public set: string = 'SUM';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'M';
  public name = 'Metal Energy';
  public fullName = 'Metal Energy SUM';
}

export class FairyEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.FAIRY];
  public set: string = 'SUM';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'Y';
  public name = 'Fairy Energy';
  public fullName = 'Fairy Energy SUM';
}