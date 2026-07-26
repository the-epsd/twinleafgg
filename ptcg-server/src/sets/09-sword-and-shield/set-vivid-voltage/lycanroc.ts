import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Lycanroc extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Rockruff';
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rock Throw',
    cost: [F],
    damage: 40,
    text: ''
  },
  {
    name: 'Sharp Mane',
    cost: [F, C],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'VIV';
  public setNumber: string = '95';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lycanroc';
  public fullName: string = 'Lycanroc VIV';
}
