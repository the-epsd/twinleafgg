import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Quaxwell extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = W;

  public hp: number = 100;

  public weakness = [{ type: L }];

  public retreat = [C];

  public attacks = [
    { name: 'Aqua Edge', cost: [W], damage: 40, text: '' }
  ];

  public set: string = 'SSP';

  public name: string = 'Quaxwell';

  public fullName: string = 'Quaxwell SSP';

  public regulationMark = 'H';

  public setNumber: string = '51';

  public cardImage: string = 'assets/cardback.png';

}