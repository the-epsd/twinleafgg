import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class GrassEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.GRASS];

  public set: string = 'RS';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '104';

  public name = 'Grass Energy';

  public fullName = 'Grass Energy RS';

}

export class FireEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FIRE];

  public set: string = 'RS';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '108';

  public name = 'Fire Energy';

  public fullName = 'Fire Energy RS';

}

export class WaterEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.WATER];

  public set: string = 'RS';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '106';

  public name = 'Water Energy';

  public fullName = 'Water Energy RS';

}

export class LightningEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.LIGHTNING];

  public set: string = 'RS';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '109';

  public name = 'Lightning Energy';

  public fullName = 'Lightning Energy RS';

}

export class PsychicEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.PSYCHIC];

  public set: string = 'RS';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '107';

  public name = 'Psychic Energy';

  public fullName = 'Psychic Energy RS';

}

export class FightingEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FIGHTING];

  public set: string = 'RS';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '105';

  public name = 'Fighting Energy';

  public fullName = 'Fighting Energy RS';

}