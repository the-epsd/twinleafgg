import { PokemonCard, Stage } from '../../game';

export class Toedscool extends PokemonCard {

  public stage = Stage.BASIC;
  public cardType = F;
  public hp = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Spray Fluid',
      cost: [C],
      damage: 10,
      text: ''
    },
  ];

  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public name: string = 'Toedscool';
  public fullName: string = 'Toedscool JTG';
}