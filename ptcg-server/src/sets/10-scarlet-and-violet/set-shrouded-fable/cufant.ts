import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Cufant extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [M];
  public hp: number = 100;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Tackle',
    cost: [M, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Confront',
    cost: [M, M, C],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'SFA';
  public setNumber: string = '41';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cufant';
  public fullName: string = 'Cufant SFA';
}
