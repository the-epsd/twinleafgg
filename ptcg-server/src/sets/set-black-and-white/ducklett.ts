import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Ducklett extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = W;

  public hp: number = 60;

  public weakness = [{
    type: L
  }];

  public resistance = [{
    type: F,
    value: -20
  }];

  public retreat = [C];

  public attacks = [
    { name: 'Water Gun', cost: [W], damage: 10, text: '' }
  ];

  public set: string = 'BLW';

  public name: string = 'Ducklett';

  public fullName: string = 'Ducklett BLW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '36';

}
