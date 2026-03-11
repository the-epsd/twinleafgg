import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

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
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public name: string = 'Wooper';
  public fullName: string = 'Wooper UF';
}
