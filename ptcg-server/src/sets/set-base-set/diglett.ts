import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Diglett extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 30;
  public weakness = [{ type: G }];
  public resistance = [{ type: L, value: -30 }];
  public retreat = [];

  public attacks = [{
    name: 'Dig',
    cost: [F],
    damage: 10,
    text: ''
  },
  {
    name: 'Mud Slap',
    cost: [F, F],
    damage: 30,
    text: ''
  }];

  public set: string = 'BS';
  public setNumber: string = '47';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Diglett';
  public fullName: string = 'Diglett BS';
}
