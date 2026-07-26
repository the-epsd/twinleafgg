import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Carkol extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Rolycoly';
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Ram',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Heat Crash',
    cost: [F, C, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'RCL';
  public setNumber: string = '106';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Carkol';
  public fullName: string = 'Carkol RCL';
}
