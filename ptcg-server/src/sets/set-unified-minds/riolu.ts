import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Riolu extends PokemonCard {

  public name = 'Riolu';
  
  public set = 'UNM';
  
  public fullName = 'Riolu UNM';

  public stage = Stage.BASIC;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '115';

  public hp = 60;
  
  public cardType = CardType.FIGHTING;

  public weakness = [{ type: CardType.PSYCHIC }]

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Kick',
      cost: [CardType.FIGHTING],
      damage: 20,
      text: ''
    }
  ];

}
