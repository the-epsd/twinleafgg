import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game';

export class Phanpy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType = F;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Mud Slap',
      cost: [F],
      damage: 10,
      text: '',
    },
    {
      name: 'Rollout',
      cost: [C, C, C],
      damage: 40,
      text: '',
    },
  ];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Phanpy';
  public fullName: string = 'Phanpy M4';
}
