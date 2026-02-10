import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Torchic2 extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 60;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Peck',
      cost: [CardType.FIRE],
      damage: 10,
      text: ''
    },
    {
      name: 'Live Coal',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'DEX';

  public setNumber: string = '15';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Torchic';

  public fullName: string = 'Torchic DEX 15';

}
