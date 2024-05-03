import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Growlithe extends PokemonCard {
  
  public set = 'BS';
  
  public fullName = 'Growlithe BS';

  public name = 'Growlithe';

  public stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;  

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '28';

  public hp = 60;

  public weakness = [{ type: CardType.WATER }];
  
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Flare',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: 20,
      text: ''
    }
  ];

}
