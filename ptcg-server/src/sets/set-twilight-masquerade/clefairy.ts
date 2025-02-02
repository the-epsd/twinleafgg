import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game';

export class Clefairy extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public cardType: CardType = P;

  public weakness = [{ type: M }];

  public hp: number = 60;

  public retreat = [C];

  public attacks = [
    {
      name: 'Moon Kick',
      cost: [C, C],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '78';

  public name: string = 'Clefairy';

  public fullName: string = 'Clefairy TWM';

}