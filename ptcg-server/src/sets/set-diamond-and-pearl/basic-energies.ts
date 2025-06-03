import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class GrassEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.GRASS];

  public set: string = 'DP';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '123';

  public name = 'Grass Energy';

  public fullName = 'Grass Energy DP';

}

export class FireEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FIRE];

  public set: string = 'DP';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '124';

  public name = 'Fire Energy';

  public fullName = 'Fire Energy DP';

}

export class WaterEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.WATER];

  public set: string = 'DP';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '125';

  public name = 'Water Energy';

  public fullName = 'Water Energy DP';

}

export class LightningEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.LIGHTNING];

  public set: string = 'DP';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '126';

  public name = 'Lightning Energy';

  public fullName = 'Lightning Energy DP';

}

export class PsychicEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.PSYCHIC];

  public set: string = 'DP';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '127';

  public name = 'Psychic Energy';

  public fullName = 'Psychic Energy DP';

}

export class FightingEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FIGHTING];

  public set: string = 'DP';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '128';

  public name = 'Fighting Energy';

  public fullName = 'Fighting Energy DP';

}

export class DarknessEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.DARK];

  public set: string = 'DP';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '129';

  public name = 'Darkness Energy';

  public fullName = 'Darkness Energy DP';

}

export class MetalEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.METAL];

  public set: string = 'DP';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '130';

  public name = 'Metal Energy';

  public fullName = 'Metal Energy DP';

}