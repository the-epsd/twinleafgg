import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';


export class Dratini extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 70;

  public weakness = [];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Tail Snap',
    cost: [ CardType.COLORLESS ],
    damage: 20,
    text: ''
  }];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '157';

  public name: string = 'Dratini';

  public fullName: string = 'Dratini OBF';

}