import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';



export class Houndour extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public tags = [ CardTag.SINGLE_STRIKE ];

  public cardType: CardType = CardType.DARK;

  public hp: number = 60;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Bite',
      cost: [CardType.COLORLESS],
      damage: 20,
      text: ''
    }];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '95';

  public name: string = 'Houndour';

  public fullName: string = 'Houndour BST';

}