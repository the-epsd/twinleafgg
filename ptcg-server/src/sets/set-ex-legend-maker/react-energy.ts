import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class ReactEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'LM';
  public name = 'React Energy';
  public fullName = 'React Energy LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public text = 'React Energy provides [C] Energy.';

}
