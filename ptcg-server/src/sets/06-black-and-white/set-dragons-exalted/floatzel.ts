import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Floatzel extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Buizel';
  public cardType: CardType[] = [W];
  public hp: number = 90;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Wave Splash',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Waterfall',
    cost: [W, W],
    damage: 60,
    text: ''
  }];

  public set: string = 'DRX';
  public setNumber: string = '33';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Floatzel';
  public fullName: string = 'Floatzel DRX';
}
