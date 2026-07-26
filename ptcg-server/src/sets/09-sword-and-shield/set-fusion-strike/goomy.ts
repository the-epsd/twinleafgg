import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Goomy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 50;
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Melt',
    cost: [W, P],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '195';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Goomy';
  public fullName: string = 'Goomy FST 195';
}
