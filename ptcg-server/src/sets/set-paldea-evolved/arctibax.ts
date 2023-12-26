import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Arctibax extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Frigibax';

  public cardType: CardType = CardType.WATER;

  public hp: number = 90;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Sharp Fin',
      cost: [ CardType.WATER, CardType.COLORLESS ],
      damage: 40,
      text: ''
    },
    {
      name: 'Frost Smash',
      cost: [ CardType.WATER, CardType.WATER, CardType.COLORLESS ],
      damage: 80,
      text: ''
    }
  ];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '59';

  public name: string = 'Arctibax';

  public fullName: string = 'Arctibax PAL';

}
