import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Chespin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 70;
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
  public set: string = 'CRI';
  public setNumber: string = '5';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Chespin';
  public fullName: string = 'Chespin M4';
}
