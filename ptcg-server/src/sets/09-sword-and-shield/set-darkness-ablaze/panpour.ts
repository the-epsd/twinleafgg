import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Panpour extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Water Gun',
    cost: [W],
    damage: 10,
    text: ''
  },
  {
    name: 'Bite',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'DAA';
  public setNumber: string = '41';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Panpour';
  public fullName: string = 'Panpour DAA';
}
