import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Chespin2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Work',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Seed Bomb',
    cost: [G, C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'BKT';
  public setNumber: string = '8';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Chespin';
  public fullName: string = 'Chespin BKT 8';
}
