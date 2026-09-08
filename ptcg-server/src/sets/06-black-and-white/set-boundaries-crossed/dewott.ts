import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Dewott extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Oshawott';
  public cardType: CardType[] = [W];
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Rain Splash',
    cost: [W],
    damage: 20,
    text: ''
  },
  {
    name: 'Waterfall',
    cost: [W, W, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'BCR';
  public setNumber: string = '40';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dewott';
  public fullName: string = 'Dewott BCR';
}
