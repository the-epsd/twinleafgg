import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Tranquill extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Pidove';
  public cardType: CardType[] = [C];
  public hp: number = 80;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Razor Wing',
    cost: [C, C],
    damage: 40,
    text: ''
  },
  {
    name: 'Gust',
    cost: [C, C, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'RCL';
  public setNumber: string = '144';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tranquill';
  public fullName: string = 'Tranquill RCL';
}
