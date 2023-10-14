import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class GrassEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.GRASS ];

  public set: string = 'SVE';

  public set2: string = 'smpromo';

  public setNumber: string = '128';

  public name = 'Grass Energy';

  public fullName = 'Grass Energy SVE';

}
