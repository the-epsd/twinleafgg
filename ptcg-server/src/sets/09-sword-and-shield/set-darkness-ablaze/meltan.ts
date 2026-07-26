import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Meltan extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Headbutt',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Beam',
    cost: [M, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'DAA';
  public setNumber: string = '129';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Meltan';
  public fullName: string = 'Meltan DAA';
}
