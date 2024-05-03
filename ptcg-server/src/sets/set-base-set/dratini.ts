import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Dratini extends PokemonCard {

  public name = 'Dratini';
  
  public set = 'BS';
  
  public fullName = 'Dratini BS';

  public stage = Stage.BASIC;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '26';

  public hp = 40;
  
  public cardType = CardType.COLORLESS;

  public resistance = [{ type: CardType.PSYCHIC, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Pound',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: ''
    }
  ];

}
