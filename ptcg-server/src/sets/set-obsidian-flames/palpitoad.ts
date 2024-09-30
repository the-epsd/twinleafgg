import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Palpitoad extends PokemonCard {
  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.WATER;

  public hp: number = 100;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public evolvesFrom: string = 'Tympole';

  public attacks = [{
    name: 'Rain Splash',
    cost: [CardType.WATER, CardType.WATER],
    damage: 50,
    text: ''
  }];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '51';

  public name: string = 'Palpitoad';

  public fullName: string = 'Palpitoad OBF';

}