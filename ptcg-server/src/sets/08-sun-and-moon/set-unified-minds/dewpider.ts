import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Dewpider extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Rain Splash',
    cost: [W],
    damage: 10,
    text: ''
  },
  {
    name: 'Bite',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'UNM';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dewpider';
  public fullName: string = 'Dewpider UNM';
}
