import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Cubchoo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 70;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Chop',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Icicle',
    cost: [W, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'DAA';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cubchoo';
  public fullName: string = 'Cubchoo DAA';
}
