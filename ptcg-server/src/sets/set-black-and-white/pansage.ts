import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Pansage extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = G;

  public hp: number = 60;

  public weakness = [{
    type: R
  }];

  public resistance = [{
    type: W,
    value: -20
  }];

  public retreat = [C];

  public attacks = [
    { name: 'Scratch', cost: [C], damage: 10, text: '' },
    { name: 'Vine Whip', cost: [G, C, C], damage: 30, text: '' }
  ];

  public set: string = 'BLW';

  public name: string = 'Pansage';

  public fullName: string = 'Pansage BLW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '7';

}
