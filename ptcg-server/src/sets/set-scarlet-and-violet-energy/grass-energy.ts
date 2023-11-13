import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class GrassEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.GRASS ];

  public set: string = 'SVE';

  public set2: string = 'fusionstrike';

  public setNumber: string = '283';

  public name = 'Basic Grass Energy';

  public fullName = 'Basic Grass Energy SVE';

}
