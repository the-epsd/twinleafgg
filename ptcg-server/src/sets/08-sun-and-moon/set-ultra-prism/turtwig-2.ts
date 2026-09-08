import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Turtwig2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Tackle',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Razor Leaf',
    cost: [G, G, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'UPR';
  public setNumber: string = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Turtwig';
  public fullName: string = 'Turtwig UPR 7';
}
