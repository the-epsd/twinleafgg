import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class PlasmaEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'PLS';

  public name = 'Plasma Energy';

  public fullName = 'Plasma Energy PLS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '127';

  public text = 'This card provides C Energy.';

}
