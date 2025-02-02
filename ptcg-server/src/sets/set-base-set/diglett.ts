import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';

export class Diglett extends PokemonCard {

  public name = 'Diglett';

  public cardImage: string = 'assets/cardback.png';

  public set = 'BS';

  public setNumber = '47';

  public fullName = 'Diglett BS';

  public cardType = CardType.FIGHTING;

  public stage = Stage.BASIC;

  public hp = 30;

  public weakness = [{ type: CardType.GRASS }];

  public resistance = [{ type: CardType.LIGHTNING, value: -30 }];

  public retreat = [];

  public attacks: Attack[] = [
    {
      name: 'Dig',
      cost: [CardType.FIGHTING],
      damage: 10,
      text: ''
    },
    {
      name: 'Mud Slap',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: 30,
      text: ''
    }
  ];

}
