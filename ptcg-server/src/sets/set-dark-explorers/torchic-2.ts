import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Torchic2 extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = R;

  public hp: number = 60;

  public weakness = [{ type: W }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Peck',
      cost: [R],
      damage: 10,
      text: ''
    },
    {
      name: 'Live Coal',
      cost: [R, C],
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
