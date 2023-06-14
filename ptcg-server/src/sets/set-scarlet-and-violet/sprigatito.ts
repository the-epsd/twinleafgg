import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';

export class Sprigatito extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Scratch',
      cost: [ CardType.COLORLESS ],
      damage: 10,
    },
    {
      name: 'Leafage',
      cost: [ CardType.GRASS, CardType.COLORLESS ],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'SVI';

  public name: string = 'Sprigatito';

  public fullName: string = 'Sprigatito SVI 13';

}
