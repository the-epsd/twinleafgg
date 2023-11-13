import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class FightingEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.FIGHTING ];

  public set: string = 'SVE';

  public set2: string = 'chillingreign';

  public setNumber: string = '233';

  public name = 'Basic Fighting Energy';

  public fullName = 'Basic Fighting Energy SVE';

}
