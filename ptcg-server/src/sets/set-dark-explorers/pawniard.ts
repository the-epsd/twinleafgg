import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Pawniard extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Scratch',
      cost: [C, C],
      damage: 20,
      text: ''
    },
    {
      name: 'Metal Claw',
      cost: [M, M, C],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '78';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pawniard';
  public fullName: string = 'Pawniard DEX';
}
