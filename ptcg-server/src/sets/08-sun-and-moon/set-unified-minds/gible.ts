import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Gible extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Stampede',
    cost: [F],
    damage: 10,
    text: ''
  },
  {
    name: 'Headbutt Bounce',
    cost: [F, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'UNM';
  public setNumber: string = '112';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gible';
  public fullName: string = 'Gible UNM';
}
