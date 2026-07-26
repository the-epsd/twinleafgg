import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Tympole extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Vibration',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Mud Shot',
    cost: [W, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'NVI';
  public setNumber: string = '22';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tympole';
  public fullName: string = 'Tympole NVI';
}
