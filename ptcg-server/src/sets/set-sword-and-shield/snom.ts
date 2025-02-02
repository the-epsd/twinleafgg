import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';


export class Snom extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'D';

  public cardType: CardType = CardType.WATER;

  public hp: number = 50;

  public weakness = [{ type: CardType.METAL }];

  public resistance = [ ];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Sprinkle Water',
      cost: [ CardType.WATER ],
      damage: 10,
      text: ''
    },
  ];

  public set: string = 'SSH';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '63';

  public name: string = 'Snom';

  public fullName: string = 'Snom SSH';

}