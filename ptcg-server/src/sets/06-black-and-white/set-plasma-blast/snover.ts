import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Snover extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 70;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Beat',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Razor Leaf',
    cost: [G, G, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'PLB';
  public setNumber: string = '25';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Snover';
  public fullName: string = 'Snover PLB';
}
