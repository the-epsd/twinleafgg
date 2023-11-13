import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class FireEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.FIRE ];

  public set: string = 'DP';

  public name = 'Basic Fire Energy';

  public fullName = 'Basic Fire Energy EVO';

}
