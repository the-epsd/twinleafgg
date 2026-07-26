import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Teddiursa extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Flop',
    cost: [C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'BKT';
  public setNumber: string = '121';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Teddiursa';
  public fullName: string = 'Teddiursa BKT';
}
