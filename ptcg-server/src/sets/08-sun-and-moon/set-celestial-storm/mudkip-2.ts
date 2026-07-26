import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Mudkip2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [W],
    damage: 10,
    text: ''
  },
  {
    name: 'Wave Splash',
    cost: [W, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'CES';
  public setNumber: string = '33';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mudkip';
  public fullName: string = 'Mudkip CES 33';
}
