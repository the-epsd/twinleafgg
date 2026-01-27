import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Carvanha extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Bite',
      cost: [C],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'GRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Carvanha';
  public fullName: string = 'Carvanha GRI';

}
