import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Wartortle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Squirtle';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Tackle',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Waterfall',
    cost: [W, W, C],
    damage: 70,
    text: ''
  }];

  public set: string = 'TEU';
  public setNumber: string = '24';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wartortle';
  public fullName: string = 'Wartortle TEU';
}
