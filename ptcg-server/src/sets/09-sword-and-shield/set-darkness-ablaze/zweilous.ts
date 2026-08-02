import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Zweilous extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Deino';
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Corkscrew Punch',
    cost: [D, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Darkness Fang',
    cost: [D, D, C],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'DAA';
  public setNumber: string = '109';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zweilous';
  public fullName: string = 'Zweilous DAA';
}
