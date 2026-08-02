import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Charmeleon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Charmander';
  public cardType: CardType = R;
  public hp: number = 100;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Steady Firebreathing',
    cost: [R],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public setNumber: string = '12';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Charmeleon';
  public fullName: string = 'Charmeleon M2';
}
