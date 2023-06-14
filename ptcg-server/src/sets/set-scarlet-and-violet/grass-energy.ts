import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class GrassEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.GRASS ];

  public set: string = 'SVI';

  public name = 'Grass Energy';

  public fullName = 'Basic Grass Energy SVE 1';

}
