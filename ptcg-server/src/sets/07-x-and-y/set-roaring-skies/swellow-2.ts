import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Swellow2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Taillow';
  public cardType: CardType[] = [C];
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Peck',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Wing Attack',
    cost: [C, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'ROS';
  public setNumber: string = '72';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Swellow';
  public fullName: string = 'Swellow ROS 72';
}
