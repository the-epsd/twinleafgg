import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Anorith extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Unidentified Fossil';
  public cardType: CardType[] = [F];
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Bug Bite',
    cost: [C, C],
    damage: 40,
    text: ''
  },
  {
    name: 'Claw Slash',
    cost: [F, C, C],
    damage: 80,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '111';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Anorith';
  public fullName: string = 'Anorith CEC';
}
