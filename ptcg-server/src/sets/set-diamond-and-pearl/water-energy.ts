import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class WaterEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.WATER ];

  public set: string = 'DP';

  public name = 'Basic Water Energy';

  public fullName = 'Basic Water Energy EVO';

}
