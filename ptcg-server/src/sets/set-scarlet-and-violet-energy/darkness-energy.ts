import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class DarknessEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.DARK ];

  public set: string = 'SVE';

  public set2: string = 'evolvingskies';

  public setNumber: string = '236';

  public name = 'Basic Darkness Energy';

  public fullName = 'Basic Darkness Energy SVE';

}
