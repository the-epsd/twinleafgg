import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Raboot2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Scorbunny';
  public cardType: CardType[] = [R];
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Kick',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Heat Blast',
    cost: [R, R],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'SSH';
  public setNumber: string = '33';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Raboot';
  public fullName: string = 'Raboot SSH 33';
}
