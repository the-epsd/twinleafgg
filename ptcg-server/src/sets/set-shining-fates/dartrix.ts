import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Dartrix extends PokemonCard {
  public regulationMark = 'D';

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public evolvesFrom: string = 'Rowlet';

  public attacks = [{
    name: 'Razor Leaf',
    cost: [CardType.GRASS],
    damage: 40,
    text: ''
  }];

  public set: string = 'SHF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '7';

  public name: string = 'Dartrix';

  public fullName: string = 'Dartrix SHF';
}