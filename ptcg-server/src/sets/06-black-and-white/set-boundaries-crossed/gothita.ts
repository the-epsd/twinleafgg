import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Gothita extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Pound',
    cost: [P],
    damage: 10,
    text: ''
  },
  {
    name: 'Psypunch',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'BCR';
  public setNumber: string = '75';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gothita';
  public fullName: string = 'Gothita BCR';
}
