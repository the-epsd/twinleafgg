import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Mudkip extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Mud Slap',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Playful Kick',
    cost: [W, C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'FST';
  public setNumber: string = '62';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mudkip';
  public fullName: string = 'Mudkip FST';
}
