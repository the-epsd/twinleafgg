import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Lombre extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Lotad';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Hook',
    cost: [G],
    damage: 20,
    text: ''
  },
  {
    name: 'Beat',
    cost: [C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'PRC';
  public setNumber: string = '11';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lombre';
  public fullName: string = 'Lombre PRC';
}
