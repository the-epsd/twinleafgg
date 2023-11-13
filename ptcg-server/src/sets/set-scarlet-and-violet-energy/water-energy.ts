import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class WaterEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.WATER ];

  public set: string = 'SVE';

  public set2: string = 'chillingreign';

  public setNumber: string = '231';

  public name = 'Basic Water Energy';

  public fullName = 'Basic Water Energy SVE';

}
