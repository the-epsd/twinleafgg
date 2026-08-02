import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Seaking extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Goldeen';
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Horn Attack',
    cost: [W],
    damage: 10,
    text: ''
  },
  {
    name: 'Waterfall',
    cost: [W, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'JU';
  public setNumber: string = '46';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Seaking';
  public fullName: string = 'Seaking JU';
}
