import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Snover extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Beat',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Razor Leaf',
    cost: [G, C, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'RCL';
  public setNumber: string = '12';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Snover';
  public fullName: string = 'Snover RCL';
}
