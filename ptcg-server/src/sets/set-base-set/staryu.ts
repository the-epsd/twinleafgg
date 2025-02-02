import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';

export class Staryu extends PokemonCard {

  public name = 'Staryu';

  public cardImage: string = 'assets/cardback.png';

  public set = 'BS';

  public fullName = 'Staryu BS';

  public setNumber = '65';

  public cardType = CardType.WATER;

  public stage = Stage.BASIC;

  public evolvesInto = ['Starmie', 'Starmie-GX'];

  public hp = 40;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Slap',
      cost: [CardType.WATER],
      damage: 20,
      text: ''
    }
  ];

}
