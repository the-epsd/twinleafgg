import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class DoubleColorlessEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS, CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '48';

  public name = 'Double Colorless Energy';

  public fullName = 'Double Colorless Energy XY';

}
