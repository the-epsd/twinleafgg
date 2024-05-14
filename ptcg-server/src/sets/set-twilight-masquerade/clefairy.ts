import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game';

export class Clefairy extends PokemonCard {
  
  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';
  
  public cardType: CardType = CardType.PSYCHIC;
  
  public weakness = [{ type: CardType.METAL }];

  public hp: number = 60;
  
  public retreat = [ CardType.COLORLESS ];
  
  public attacks = [
    {
      name: 'Moon Kick',
      cost: [ CardType.COLORLESS ],
      damage: 40,
      text: ''
    }
  ];
  
  public set: string = 'SV6';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '45';
  
  public name: string = 'Clefairy';
  
  public fullName: string = 'Clefairy SV6';

}