import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Pansear extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = R;

  public hp: number = 60;

  public weakness = [{
    type: CardType.WATER
  }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    { name: 'Scratch', cost: [C], damage: 10, text: '' },
    { name: 'Live Coal', cost: [R, C, C], damage: 30, text: '' }
  ];

  public set: string = 'BLW';

  public name: string = 'Pansear';

  public fullName: string = 'Pansear BLW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '21';

}
