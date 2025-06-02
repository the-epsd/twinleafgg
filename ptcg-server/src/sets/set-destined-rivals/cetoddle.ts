import { PokemonCard, Stage, CardType } from '../../game';

export class Cetoddle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Gentle Slap',
      cost: [W, C],
      damage: 30,
      text: ''
    },
    {
      name: 'Frost Smash',
      cost: [W, W, W, C],
      damage: 80,
      text: ''
    }
  ];

  public set: string = 'DRI';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Cetoddle';
  public fullName: string = 'Cetoddle DRI';
}
