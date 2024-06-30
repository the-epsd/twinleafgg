import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class GalarianLinoone extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public regulationMark = 'E';

  public cardType: CardType = CardType.DARK;

  public hp: number = 60;
  
  public evolvesFrom = 'Galarian Zigzagoon';

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = 
    [
      {
        name: 'Rear Kick',
        cost: [ CardType.DARK ],
        damage: 30,
        text: ''
      }
    ];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '160';

  public name: string = 'Galarian Linoone';

  public fullName: string = 'Galarian Linoone FST';
}