import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';

export class Quaxly extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 70;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Pound',
      cost: [ CardType.COLORLESS ],
      damage: 10,
    },
    {
      name: 'Kick',
      cost: [ CardType.WATER, CardType.COLORLESS ],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'SVI';

  public name: string = 'Quaxly';

  public fullName: string = 'Quaxly SVI 52';

}
