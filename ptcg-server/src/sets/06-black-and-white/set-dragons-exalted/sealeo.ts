import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Sealeo extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Spheal';
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Ice Ball',
    cost: [W, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Aurora Beam',
    cost: [W, C, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'DRX';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sealeo';
  public fullName: string = 'Sealeo DRX';
}
