import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Timburr extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = F;

  public hp: number = 60;

  public weakness = [{
    type: P
  }];

  public retreat = [C, C];

  public attacks = [
    { name: 'Pound', cost: [F], damage: 10, text: '' }
  ];

  public set: string = 'BLW';

  public name: string = 'Timburr';

  public fullName: string = 'Timburr BLW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '58';

}
