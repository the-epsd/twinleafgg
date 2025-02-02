import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';

export class Ponyta extends PokemonCard {

  public name = 'Ponyta';

  public cardImage: string = 'assets/cardback.png';

  public set = 'BS';

  public setNumber = '60';

  public cardType = CardType.FIRE;

  public fullName = 'Ponyta BS';

  public stage = Stage.BASIC;

  public evolvesInto = ['Rapidash', 'Dark Rapidash'];

  public hp = 40;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Smash Kick',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: ''
    },
    {
      name: 'Flame Tail',
      cost: [CardType.FIRE, CardType.FIRE],
      damage: 30,
      text: ''
    }
  ];

}
