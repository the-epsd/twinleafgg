import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class DarknessEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.DARK ];

  public set: string = 'DP';

  public name = 'Basic Darkness Energy';

  public fullName = 'Basic Darkness Energy EVO';

}
