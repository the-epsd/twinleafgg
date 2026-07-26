import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Phanpy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Mud Slap',
    cost: [F],
    damage: 10,
    text: ''
  },
  {
    name: 'Rollout',
    cost: [C, C, C],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public setNumber: string = '44';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Phanpy';
  public fullName: string = 'Phanpy M4';
}
