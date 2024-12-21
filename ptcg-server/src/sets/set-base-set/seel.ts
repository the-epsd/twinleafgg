import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';

export class Seel extends PokemonCard {

  public name = 'Seel';

  public cardImage: string = 'assets/cardback.png';

  public set = 'BS';

  public setNumber = '41';

  public fullName = 'Seel BS';

  public cardType = CardType.WATER;

  public stage = Stage.BASIC;

  public hp = 60;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Headbutt',
      cost: [CardType.WATER],
      damage: 10,
      text: ''
    }
  ];

}
