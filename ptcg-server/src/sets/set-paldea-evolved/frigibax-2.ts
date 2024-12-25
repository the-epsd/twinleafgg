import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Frigibax2 extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 70;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Chilly',
      cost: [CardType.WATER],
      damage: 10,
      text: ''
    },
    {
      name: 'Bite',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '58';

  public name: string = 'Frigibax';

  public fullName: string = 'Frigibax PAL2';

}
