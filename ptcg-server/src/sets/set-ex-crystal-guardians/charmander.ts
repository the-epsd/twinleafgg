import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';

export class Charmander extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.DELTA_SPECIES];

  public cardType: CardType = L;

  public hp: number = 50;

  public weakness = [{ type: W }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Scratch',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Bite',
      cost: [L, C],
      damage: 20,
      text: ''
    },
  ];

  public set: string = 'CG';

  public name: string = 'Charmander';

  public fullName: string = 'Charmander CG';

  public setNumber: string = '49';

  public cardImage: string = 'assets/cardback.png';

}
