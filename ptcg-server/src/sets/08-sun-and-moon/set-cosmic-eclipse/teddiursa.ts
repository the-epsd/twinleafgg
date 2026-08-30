import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Teddiursa extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Scratch',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Slash',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '171';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Teddiursa';
  public fullName: string = 'Teddiursa CEC';
}
