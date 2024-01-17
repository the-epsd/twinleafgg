import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class FireEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.FIRE ];

  public set: string = 'SVE';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '284';

  public name = 'Basic Fire Energy';

  public fullName = 'Basic Fire Energy SVE';

}
