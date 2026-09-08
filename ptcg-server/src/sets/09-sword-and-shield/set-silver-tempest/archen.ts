import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Archen extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Unidentified Fossil';
  public cardType: CardType[] = [C];
  public hp: number = 80;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Flap',
    cost: [C],
    damage: 30,
    text: ''
  },
  {
    name: 'Claw Slash',
    cost: [C, C, C],
    damage: 80,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'SIT';
  public setNumber: string = '146';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Archen';
  public fullName: string = 'Archen SIT';
}
