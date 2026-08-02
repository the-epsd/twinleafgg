import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Tepig extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Ram',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Combustion',
    cost: [R, R, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'SWSH';
  public setNumber: string = '172';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tepig';
  public fullName: string = 'Tepig SWSH';
}
