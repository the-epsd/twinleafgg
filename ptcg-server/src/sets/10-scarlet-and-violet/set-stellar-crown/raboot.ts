import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Raboot extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Scorbunny';
  public cardType: CardType[] = [R];
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Low Sweep',
    cost: [R],
    damage: 30,
    text: ''
  },
  {
    name: 'Combustion',
    cost: [R, C, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public setNumber: string = '27';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Raboot';
  public fullName: string = 'Raboot SCR';
}
