import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Drakloak extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public regulationMark = 'F';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks =
    [
      {
        name: 'Spooky Shot',
        cost: [CardType.PSYCHIC],
        damage: 40,
        text: ''
      }
    ];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '88';

  public evolvesFrom: string = 'Dreepy';

  public name: string = 'Drakloak';

  public fullName: string = 'Drakloak SIT';
}