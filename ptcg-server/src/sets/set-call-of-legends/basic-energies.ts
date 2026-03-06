import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class GrassEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.GRASS];
  public set: string = 'CL';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public name = 'Grass Energy';
  public fullName = 'Grass Energy CL';
}

export class FireEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.FIRE];
  public set: string = 'CL';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';
  public name = 'Fire Energy';
  public fullName = 'Fire Energy CL';
}

export class WaterEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.WATER];
  public set: string = 'CL';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';
  public name = 'Water Energy';
  public fullName = 'Water Energy CL';
}

export class LightningEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.LIGHTNING];
  public set: string = 'CL';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name = 'Lightning Energy';
  public fullName = 'Lightning Energy CL';
}

export class PsychicEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.PSYCHIC];
  public set: string = 'CL';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name = 'Psychic Energy';
  public fullName = 'Psychic Energy CL';
}

export class FightingEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.FIGHTING];
  public set: string = 'CL';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name = 'Fighting Energy';
  public fullName = 'Fighting Energy CL';
}

export class DarknessEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.DARK];
  public set: string = 'CL';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name = 'Darkness Energy';
  public fullName = 'Darkness Energy CL';
}

export class MetalEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.METAL];
  public set: string = 'CL';
  public regulationMark = 'ENERGY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';
  public name = 'Metal Energy';
  public fullName = 'Metal Energy CL';
}