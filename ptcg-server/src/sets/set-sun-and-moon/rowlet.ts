import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Rowlet extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    { name: 'Tackle', cost: [CardType.COLORLESS], damage: 10, text: '' },
    { name: 'Leafage', cost: [CardType.GRASS, CardType.COLORLESS], damage: 20, text: '' }
  ];

  public set: string = 'SUM';

  public setNumber = '9';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Rowlet';

  public fullName: string = 'Rowlet SUM';

}
