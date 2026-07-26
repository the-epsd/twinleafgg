import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Phanpy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Tackle',
    cost: [F],
    damage: 10,
    text: ''
  },
  {
    name: 'Rollout',
    cost: [F, F, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'PLS';
  public setNumber: string = '71';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Phanpy';
  public fullName: string = 'Phanpy PLS';
}
