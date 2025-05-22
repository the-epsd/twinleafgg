import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class GrassEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.GRASS];

  public set: string = 'EX';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '162';

  public name = 'Grass Energy';

  public fullName = 'Grass Energy EX';

}

export class FireEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FIRE];

  public set: string = 'EX';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '161';

  public name = 'Fire Energy';

  public fullName = 'Fire Energy EX';

}

export class WaterEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.WATER];

  public set: string = 'EX';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '165';

  public name = 'Water Energy';

  public fullName = 'Water Energy EX';

}

export class LightningEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.LIGHTNING];

  public set: string = 'EX';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '163';

  public name = 'Lightning Energy';

  public fullName = 'Lightning Energy EX';

}

export class PsychicEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.PSYCHIC];

  public set: string = 'EX';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '164';

  public name = 'Psychic Energy';

  public fullName = 'Psychic Energy EX';

}

export class FightingEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FIGHTING];

  public set: string = 'EX';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '160';

  public name = 'Fighting Energy';

  public fullName = 'Fighting Energy EX';

}