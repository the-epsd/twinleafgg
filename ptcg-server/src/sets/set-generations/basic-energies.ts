import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class GrassEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.GRASS];

  public set: string = 'GEN';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '75';

  public name = 'Grass Energy';

  public fullName = 'Grass Energy GEN';

}

export class FireEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FIRE];

  public set: string = 'GEN';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '76';

  public name = 'Fire Energy';

  public fullName = 'Fire Energy GEN';

}

export class WaterEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.WATER];

  public set: string = 'GEN';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '77';

  public name = 'Water Energy';

  public fullName = 'Water Energy GEN';

}

export class LightningEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.LIGHTNING];

  public set: string = 'GEN';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '78';

  public name = 'Lightning Energy';

  public fullName = 'Lightning Energy GEN';

}

export class PsychicEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.PSYCHIC];

  public set: string = 'GEN';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '79';

  public name = 'Psychic Energy';

  public fullName = 'Psychic Energy GEN';

}

export class FightingEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FIGHTING];

  public set: string = 'GEN';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '80';

  public name = 'Fighting Energy';

  public fullName = 'Fighting Energy GEN';

}

export class DarknessEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.DARK];

  public set: string = 'GEN';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '81';

  public name = 'Darkness Energy';

  public fullName = 'Darkness Energy GEN';

}

export class MetalEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.METAL];

  public set: string = 'GEN';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '82';

  public name = 'Metal Energy';

  public fullName = 'Metal Energy GEN';

}

export class FairyEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.FAIRY];

  public set: string = 'GEN';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '83';

  public name = 'Fairy Energy';

  public fullName = 'Fairy Energy GEN';

}