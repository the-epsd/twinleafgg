import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';


export class Pidgeotto extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pidgey';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 90;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS ];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public attacks = [
    { name: 'Wing Attack', 
      cost: [CardType.COLORLESS, CardType.COLORLESS], 
      damage: 40, 
      text: '' },
  ];

  public set: string = 'OBF';

  public name: string = 'Pidgeotto';

  public fullName: string = 'Pidgeotto OBF';

}