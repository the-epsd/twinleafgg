import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Wooper extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Mud Shot',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Tail Whap',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'UF';
  public setNumber: string = '79';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wooper';
  public fullName: string = 'Wooper UF';
}
