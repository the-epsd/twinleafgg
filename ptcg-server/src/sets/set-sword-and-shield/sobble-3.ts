import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Sobble3 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Water Gun',
      cost: [W],
      damage: 20,
      text: ''
    }
  ];

  public regulationMark: string = 'D';
  public set: string = 'SSH';
  public setNumber: string = '54';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sobble';
  public fullName: string = 'Sobble SSH 54';
}
