import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Patrat extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = C;

  public hp: number = 50;

  public weakness = [{
    type: F
  }];

  public retreat = [C];

  public attacks = [
    { name: 'Tackle', cost: [C], damage: 10, text: '' },
    { name: 'Bite', cost: [C, C], damage: 20, text: '' }
  ];

  public set: string = 'BLW';

  public name: string = 'Patrat';

  public fullName: string = 'Patrat BLW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '77';

}
