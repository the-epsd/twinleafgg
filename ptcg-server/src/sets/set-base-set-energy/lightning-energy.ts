import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class LightningEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.LIGHTNING ];

  public set: string = 'BS';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '100';

  public name = 'Lightning Energy';

  public fullName = 'Lightning Energy BS';

}
