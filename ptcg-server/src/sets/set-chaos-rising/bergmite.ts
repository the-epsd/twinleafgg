import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game';

export class Bergmite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType = W;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Chilly',
    cost: [W],
    damage: 10,
    text: ''
  },
  {
    name: 'Frost Breath',
    cost: [W, C, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Bergmite';
  public fullName: string = 'Bergmite M4';
}
