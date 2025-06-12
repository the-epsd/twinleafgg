import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Blipbug extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Stampede',
      cost: [P],
      damage: 10,
      text: ''
    },
  ];

  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Blipbug';
  public fullName: string = 'Blipbug BST';

}