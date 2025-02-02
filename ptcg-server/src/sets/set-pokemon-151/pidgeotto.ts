import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';


export class Pidgeotto extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pidgey';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 80;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ ];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public attacks = [
    { name: 'Flap', 
      cost: [CardType.COLORLESS], 
      damage: 20, 
      text: '' },
  ];

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '17';

  public name: string = 'Pidgeotto';

  public fullName: string = 'Pidgeotto MEW';

}