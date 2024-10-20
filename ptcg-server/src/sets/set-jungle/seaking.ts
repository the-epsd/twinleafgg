import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Seaking extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.WATER;

  public hp: number = 70;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public evolvesFrom = 'Goldeen';

  public attacks = [{
    name: 'Horn Attack',
    cost: [CardType.WATER],
    damage: 10,
    text: ''
  },
  {
    name: 'Waterfall',
    cost: [CardType.WATER, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '46';

  public name: string = 'Seaking';

  public fullName: string = 'Seaking JU';
}