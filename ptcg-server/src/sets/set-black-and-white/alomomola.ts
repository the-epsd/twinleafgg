import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Alomomola extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = W;

  public hp: number = 100;

  public weakness = [{
    type: CardType.LIGHTNING
  }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    { name: 'Pound', cost: [C, C], damage: 20, text: '' },
    { name: 'Wave Splash', cost: [W, W, C, C], damage: 60, text: '' }
  ];

  public set: string = 'BLW';

  public name: string = 'Alomomola';

  public fullName: string = 'Alomomola BLW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '38';

}
