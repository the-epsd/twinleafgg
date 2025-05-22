import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class GrassEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.GRASS];

  public set: string = 'HP';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '105';

  public name = 'Grass Energy';

  public fullName = 'Grass Energy HP';

}

export class FireEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FIRE];

  public set: string = 'HP';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '106';

  public name = 'Fire Energy';

  public fullName = 'Fire Energy HP';

}

export class WaterEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.WATER];

  public set: string = 'HP';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '107';

  public name = 'Water Energy';

  public fullName = 'Water Energy HP';

}

export class LightningEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.LIGHTNING];

  public set: string = 'HP';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '108';

  public name = 'Lightning Energy';

  public fullName = 'Lightning Energy HP';

}

export class PsychicEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.PSYCHIC];

  public set: string = 'HP';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '109';

  public name = 'Psychic Energy';

  public fullName = 'Psychic Energy HP';

}

export class FightingEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FIGHTING];

  public set: string = 'HP';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '110';

  public name = 'Fighting Energy';

  public fullName = 'Fighting Energy HP';

}