import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class LightningEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.LIGHTNING ];

  public set: string = 'SVE';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '235';

  public name = 'Basic Lightning Energy';

  public fullName = 'Basic Lightning Energy SVE';

}
