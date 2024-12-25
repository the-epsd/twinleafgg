import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';

export class Machop extends PokemonCard {

  public name = 'Machop';

  public cardImage: string = 'assets/cardback.png';

  public set = 'BS';

  public setNumber = '52';

  public fullName = 'Machop BS';

  public cardType = CardType.FIGHTING;

  public stage = Stage.BASIC;

  public hp = 50;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreatCost = [{ type: CardType.COLORLESS }];

  public attacks: Attack[] = [
    {
      name: 'Low Kick',
      cost: [CardType.FIGHTING],
      damage: 20,
      text: ''
    }
  ];

}
