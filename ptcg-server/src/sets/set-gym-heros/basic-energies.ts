import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class GrassEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.GRASS];

  public set: string = 'G1';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '129';

  public name = 'Grass Energy';

  public fullName = 'Grass Energy (G1 129)';
  public legacyFullName = 'Grass Energy G1';

}

export class FireEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FIRE];

  public set: string = 'G1';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '128';

  public name = 'Fire Energy';

  public fullName = 'Fire Energy (G1 128)';
  public legacyFullName = 'Fire Energy G1';

}

export class WaterEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.WATER];

  public set: string = 'G1';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '132';

  public name = 'Water Energy';

  public fullName = 'Water Energy (G1 132)';
  public legacyFullName = 'Water Energy G1';

}

export class LightningEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.LIGHTNING];

  public set: string = 'G1';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '130';

  public name = 'Lightning Energy';

  public fullName = 'Lightning Energy (G1 130)';
  public legacyFullName = 'Lightning Energy G1';

}

export class PsychicEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.PSYCHIC];

  public set: string = 'G1';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '131';

  public name = 'Psychic Energy';

  public fullName = 'Psychic Energy (G1 131)';
  public legacyFullName = 'Psychic Energy G1';

}

export class FightingEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FIGHTING];

  public set: string = 'G1';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '127';

  public name = 'Fighting Energy';

  public fullName = 'Fighting Energy (G1 127)';
  public legacyFullName = 'Fighting Energy G1';

}