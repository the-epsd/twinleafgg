import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class FireEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.FIRE ];

  public set: string = 'BS';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '98';

  public name = 'Basic Fire Energy';

  public fullName = 'Basic Fire Energy BS';

}
