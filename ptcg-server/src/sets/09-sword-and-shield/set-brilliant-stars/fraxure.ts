import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Fraxure extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Axew';
  public cardType: CardType = N;
  public hp: number = 100;
  public retreat = [C, C];

  public attacks = [{
    name: 'Sharp Fang',
    cost: [C],
    damage: 30,
    text: ''
  },
  {
    name: 'Dragon Claw',
    cost: [F, M],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'BRS';
  public setNumber: string = '111';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Fraxure';
  public fullName: string = 'Fraxure BRS 111';
}
