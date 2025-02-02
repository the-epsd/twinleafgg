import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class FairyEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.FAIRY ];

  public set: string = 'XY';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '140';

  public name = 'Fairy Energy';

  public fullName = 'Fairy Energy XY';

}
