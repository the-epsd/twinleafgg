import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Dugtrio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Diglett';
  public cardType: CardType[] = [F];
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Mud Bomb',
    cost: [F],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'SSH';
  public setNumber: string = '93';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dugtrio';
  public fullName: string = 'Dugtrio SSH';
}
