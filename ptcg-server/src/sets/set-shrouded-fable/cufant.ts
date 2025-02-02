import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Cufant extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 100;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Tackle',
      cost: [CardType.METAL, CardType.COLORLESS],
      damage: 30,
      text: ''
    },
    {
      name: 'Confront',
      cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS],
      damage: 70,
      text: ''
    },
  ];

  public regulationMark: string = 'H';

  public set: string = 'SFA';

  public name: string = 'Cufant';

  public fullName: string = 'Cufant SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '41';

}