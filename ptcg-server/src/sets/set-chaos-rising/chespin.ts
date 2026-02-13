import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game';

export class Chespin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = G;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Beat',
    cost: [G],
    damage: 10,
    text: ''
  },
  {
    name: 'Spike Sting',
    cost: [G, G],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Chespin';
  public fullName: string = 'Chespin M4';
}
