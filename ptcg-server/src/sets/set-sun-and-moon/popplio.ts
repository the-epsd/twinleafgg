import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Popplio extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Pound',
    cost: [W],
    damage: 10,
    text: ''
  },
  {
    name: 'Water Gun',
    cost: [W, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'SUM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Popplio';
  public fullName: string = 'Popplio SUM';
}