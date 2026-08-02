import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Axew extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 70;
  public retreat = [C, C];

  public attacks = [{
    name: 'Scratch',
    cost: [F],
    damage: 10,
    text: ''
  },
  {
    name: 'Sharp Fang',
    cost: [F, M],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'SFA';
  public setNumber: string = '44';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Axew';
  public fullName: string = 'Axew SFA';
}
