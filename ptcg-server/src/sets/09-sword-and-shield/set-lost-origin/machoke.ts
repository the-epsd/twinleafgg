import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Machoke extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Machop';
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Strength',
    cost: [F],
    damage: 30,
    text: ''
  },
  {
    name: 'Seismic Toss',
    cost: [F, F],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'LOR';
  public setNumber: string = '87';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Machoke';
  public fullName: string = 'Machoke LOR 87';
}
