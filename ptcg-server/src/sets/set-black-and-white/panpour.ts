import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Panpour extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = W;

  public hp: number = 60;

  public weakness = [{
    type: L
  }];

  public retreat = [C];

  public attacks = [
    { name: 'Scratch', cost: [C], damage: 10, text: '' },
    { name: 'Water Gun', cost: [W, C, C], damage: 30, text: '' }
  ];

  public set: string = 'BLW';

  public name: string = 'Panpour';

  public fullName: string = 'Panpour BLW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '33';

}
