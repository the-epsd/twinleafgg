import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';

export class HopsCorvisquire extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Hop\'s Rookidee';

  public tags = [CardTag.HOPS];

  public cardType: CardType = C;

  public hp: number = 90;

  public weakness = [{ type: L }];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [C];

  public attacks = [
    { name: 'Speed Dive', cost: [C], damage: 30, text: '' },
    { name: 'Razor Wing', cost: [C, C, C], damage: 80, text: '' },
  ];

  public regulationMark = 'I';

  public set: string = 'SV9';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '84';

  public name: string = 'Hop\'s Corvisquire';

  public fullName: string = 'Hop\'s Corvisquire SV9';
  
}