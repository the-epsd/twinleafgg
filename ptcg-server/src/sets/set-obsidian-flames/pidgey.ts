import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';


export class Pidgey extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 60;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS ];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public attacks = [
    { name: 'Gust', 
      cost: [CardType.COLORLESS], 
      damage: 20, 
      text: '' },
  ];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '162';

  public name: string = 'Pidgey';

  public fullName: string = 'Pidgey OBF';

}