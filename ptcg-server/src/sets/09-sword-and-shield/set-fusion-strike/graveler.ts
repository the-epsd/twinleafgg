import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Graveler extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Geodude';
  public cardType: CardType = F;
  public hp: number = 110;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Tackle',
    cost: [F],
    damage: 30,
    text: ''
  },
  {
    name: 'Boulder Crush',
    cost: [F, C, C],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '136';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Graveler';
  public fullName: string = 'Graveler FST 136';
}
