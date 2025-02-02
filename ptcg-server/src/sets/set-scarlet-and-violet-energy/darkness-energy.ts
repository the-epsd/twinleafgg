import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class DarknessEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.DARK];

  public set: string = 'SVE';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '7';

  public name = 'Darkness Energy';

  public fullName = 'Darkness Energy SVE';

}
