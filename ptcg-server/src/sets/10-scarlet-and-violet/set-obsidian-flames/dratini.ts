import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Dratini extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 70;
  public weakness = [];
  public retreat = [C];

  public attacks = [{
    name: 'Tail Snap',
    cost: [C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public setNumber: string = '157';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dratini';
  public fullName: string = 'Dratini OBF';
}
