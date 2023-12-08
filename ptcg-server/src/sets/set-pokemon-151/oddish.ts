import { PokemonCard, Stage, CardType } from '../../game';

export class Oddish extends PokemonCard {

  public stage = Stage.BASIC;

  public cardType = CardType.GRASS;
  
  public hp = 60;
  
  public weakness = [{ type: CardType.FIRE }];
  
  public retreat = [CardType.COLORLESS];
  
  public attacks = [{
    name: 'Razor Leaf', 
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];

  public set: string = '151';

  public set2: string = '151';

  public setNumber: string = '43';

  public name: string = 'Oddish';

  public fullName: string = 'Oddish MEW';

}
