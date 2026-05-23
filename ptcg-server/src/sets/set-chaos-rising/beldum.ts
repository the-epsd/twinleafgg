import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game';

export class Beldum extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = M;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Headbutt',
      cost: [M],
      damage: 10,
      text: '',
    },
    {
      name: 'Beam',
      cost: [M, C],
      damage: 20,
      text: '',
    },
  ];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Beldum';
  public fullName: string = 'Beldum M4';
}
