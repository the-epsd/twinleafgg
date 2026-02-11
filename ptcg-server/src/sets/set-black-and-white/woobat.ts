import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Woobat extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = P;

  public hp: number = 50;

  public weakness = [{
    type: L
  }];

  public resistance = [{
    type: F,
    value: -20
  }];

  public retreat = [C];

  public attacks = [
    { name: 'Gust', cost: [C], damage: 10, text: '' }
  ];

  public set: string = 'BLW';

  public name: string = 'Woobat';

  public fullName: string = 'Woobat BLW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '50';

}
