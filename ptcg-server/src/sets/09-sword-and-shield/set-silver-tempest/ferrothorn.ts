import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Ferrothorn extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Ferroseed';
  public cardType: CardType[] = [M];
  public hp: number = 130;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Spinning Attack',
    cost: [M, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Whip Smash',
    cost: [M, M, C],
    damage: 130,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'SIT';
  public setNumber: string = '122';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ferrothorn';
  public fullName: string = 'Ferrothorn SIT 122';
}
