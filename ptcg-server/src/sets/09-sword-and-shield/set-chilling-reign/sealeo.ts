import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Sealeo extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Spheal';
  public cardType: CardType[] = [W];
  public hp: number = 110;
  public weakness = [{ type: M }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Ram',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Aurora Beam',
    cost: [W, W, C],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'CRE';
  public setNumber: string = '38';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sealeo';
  public fullName: string = 'Sealeo CRE';
}
