import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';


export class Remoraid extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public tags = [ CardTag.RAPID_STRIKE ];

  public cardType: CardType = CardType.WATER;

  public hp: number = 60;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [ ];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Water Gun',
      cost: [ CardType.WATER ],
      damage: 10,
      text: ''
    },
    {
      name: 'Sharp Fin',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 20,
      text: ''
    },
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '36';

  public name: string = 'Remoraid';

  public fullName: string = 'Remoraid BST';

}