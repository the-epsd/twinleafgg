import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Snover extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Beat',
    cost: [W],
    damage: 10,
    text: ''
  },
  {
    name: 'Icy Snow',
    cost: [W, W],
    damage: 30,
    text: ''
  }];

  public set: string = 'M1S';
  public name: string = 'Snover';
  public fullName: string = 'Snover M1S';
  public setNumber: string = '17';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
}