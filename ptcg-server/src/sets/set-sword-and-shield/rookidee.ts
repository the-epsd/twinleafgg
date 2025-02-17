import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Rookidee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Flap',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Glide',
      cost: [C, C],
      damage: 30,
      text: ''
    }
  ];

  public regulationMark = 'D';
  public set: string = 'SSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '150';
  public name: string = 'Rookidee';
  public fullName: string = 'Rookidee SSH';
}
