import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Blitzle extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = L;

  public hp: number = 60;

  public weakness = [{
    type: F
  }];

  public retreat = [C];

  public attacks = [
    { name: 'Rear Kick', cost: [L, C], damage: 20, text: '' }
  ];

  public set: string = 'BLW';

  public name: string = 'Blitzle';

  public fullName: string = 'Blitzle BLW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '40';

}
