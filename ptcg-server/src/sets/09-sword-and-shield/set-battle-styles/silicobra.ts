import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Silicobra extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Tail Whap',
    cost: [F],
    damage: 10,
    text: ''
  },
  {
    name: 'Mud Shot',
    cost: [F, F, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'BST';
  public setNumber: string = '81';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Silicobra';
  public fullName: string = 'Silicobra BST';
}
