import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Cherubi extends PokemonCard {

  public stage: Stage = Stage.BASIC;  
  
  public regulationMark = 'E';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 40;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [ ];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Leafage',
      cost: [ CardType.GRASS, CardType.COLORLESS ],
      damage: 20,
      text: ''
    },
  ];

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '12';

  public name: string = 'Cherubi';

  public fullName: string = 'Cherubi BRS';

}