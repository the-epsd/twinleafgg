import { Card } from './card';
import { SuperType, CardType, EnergyType, Format } from './card-types';


export abstract class EnergyCard extends Card {

  public superType: SuperType = SuperType.ENERGY;
  
  public energyType: EnergyType = EnergyType.BASIC;

  public format: Format = Format.NONE;

  public provides: CardType[] = [];

  public text: string = '';

  public isBlocked = false;
}
