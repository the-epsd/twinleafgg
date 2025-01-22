import { PokemonCard, Stage } from '../../game';

export class Gible extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = N;
  public hp: number = 70;
  public retreat = [C];

  public attacks = [{
    name: 'Gnaw',
    cost: [W, R],
    damage: 30,
    text: ''
  }];

  public regulationMark: string = 'F';
  public set: string = 'BRS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Gible';
  public fullName: string = 'Gible BRS';
}