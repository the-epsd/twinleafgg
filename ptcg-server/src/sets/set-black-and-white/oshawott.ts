import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Oshawott extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = W;

  public hp: number = 60;

  public weakness = [{
    type: L
  }];

  public retreat = [C];

  public attacks = [
    { name: 'Tackle', cost: [W], damage: 10, text: '' },
    { name: 'Water Gun', cost: [W, C], damage: 20, text: '' }
  ];

  public set: string = 'BLW';

  public name: string = 'Oshawott';

  public fullName: string = 'Oshawott BLW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '27';

}
