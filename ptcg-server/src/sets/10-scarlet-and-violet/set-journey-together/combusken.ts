import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Combusken extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Torchic';
  public cardType: CardType = R;
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Slash',
    cost: [R, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'JTG';
  public setNumber: string = '23';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Combusken';
  public fullName: string = 'Combusken JTG';
}
