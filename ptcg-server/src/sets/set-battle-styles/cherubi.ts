import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';


export class Cherubi extends PokemonCard {

  public stage: Stage = Stage.BASIC;  
  
  public regulationMark = 'E';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 50;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [ ];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Leafage',
      cost: [ CardType.WATER ],
      damage: 10,
      text: ''
    },
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '7';

  public name: string = 'Cherubi';

  public fullName: string = 'Cherubi BST';

}