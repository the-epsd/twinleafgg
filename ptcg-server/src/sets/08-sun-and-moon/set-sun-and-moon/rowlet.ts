import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Rowlet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Leafage',
    cost: [G, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'SUM';
  public setNumber: string = '9';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rowlet';
  public fullName: string = 'Rowlet SUM';
}
