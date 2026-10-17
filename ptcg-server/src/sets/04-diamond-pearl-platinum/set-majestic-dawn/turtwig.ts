import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';

export class Turtwig extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +10 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rollout',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Razor Leaf',
    cost: [G, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '77';
  public name: string = 'Turtwig';
  public fullName: string = 'Turtwig MD';
}
