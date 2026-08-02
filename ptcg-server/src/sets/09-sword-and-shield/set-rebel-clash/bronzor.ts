import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Bronzor extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Ram',
    cost: [M],
    damage: 10,
    text: ''
  },
  {
    name: 'Speed Dive',
    cost: [M, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'RCL';
  public setNumber: string = '129';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bronzor';
  public fullName: string = 'Bronzor RCL';
}
