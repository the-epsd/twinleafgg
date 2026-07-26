import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Fraxure2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Axew';
  public cardType: CardType = N;
  public hp: number = 80;
  public weakness = [{ type: N }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Scratch',
    cost: [M, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Sharp Fang',
    cost: [F, C, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'DRV';
  public setNumber: string = '15';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Fraxure';
  public fullName: string = 'Fraxure DRV 15';
}
