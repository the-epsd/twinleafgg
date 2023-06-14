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
      name: 'Dig Claws',
      cost: [ CardType.COLORLESS,CardType.COLORLESS  ],
      damage: 30,
      text: ''
    },
  ];

  public set: string = 'PAL';

  public name: string = 'Sprigatito';

  public fullName: string = 'Sprigatito PAL 13';

}
