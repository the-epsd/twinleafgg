import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class GrassEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.GRASS];
  public set: string = 'MEE';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name = 'Grass Energy';
  public fullName = 'Grass Energy MEE';
}

export class FireEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.FIRE];
  public set: string = 'MEE';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name = 'Fire Energy';
  public fullName = 'Fire Energy MEE';
}

export class WaterEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.WATER];
  public set: string = 'MEE';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name = 'Water Energy';
  public fullName = 'Water Energy MEE';
}

export class LightningEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.LIGHTNING];
  public set: string = 'MEE';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name = 'Lightning Energy';
  public fullName = 'Lightning Energy MEE';
}

export class PsychicEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.PSYCHIC];
  public set: string = 'MEE';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name = 'Psychic Energy';
  public fullName = 'Psychic Energy MEE';
}

export class FightingEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.FIGHTING];
  public set: string = 'MEE';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name = 'Fighting Energy';
  public fullName = 'Fighting Energy MEE';
}

export class DarknessEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.DARK];
  public set: string = 'MEE';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name = 'Darkness Energy';
  public fullName = 'Darkness Energy MEE';
}

export class MetalEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.METAL];
  public set: string = 'MEE';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name = 'Metal Energy';
  public fullName = 'Metal Energy MEE';
}
