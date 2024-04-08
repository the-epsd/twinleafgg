import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class PsychicEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.PSYCHIC ];

  public set: string = 'BS';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '101';

  public name = 'Psychic Energy';

  public fullName = 'Psychic Energy BS';

}
