import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class WaterEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.WATER ];

  public set: string = 'SVE';

  public set2: string = 'smpromo';

  public setNumber: string = '130';

  public name = 'Water Energy';

  public fullName = 'Water Energy SVE';

}
