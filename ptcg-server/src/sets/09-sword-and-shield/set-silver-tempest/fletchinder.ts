import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Fletchinder extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Fletchling';
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Steady Firebreathing',
    cost: [R],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'SIT';
  public setNumber: string = '28';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Fletchinder';
  public fullName: string = 'Fletchinder SIT 28';
}
