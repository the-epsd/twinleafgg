import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Gothita2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Smack',
      cost: [C, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Gothita';
  public fullName: string = 'Gothita EPO 44';
}
