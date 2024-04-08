import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class GrassEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.GRASS ];

  public set: string = 'BS';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '99';

  public name = 'Grass Energy';

  public fullName = 'Grass Energy BS';

}
