import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';

export class Tarountula extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = G;
  public hp = 60;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Hook',
    cost: [G, G],
    damage: 40,
    text: ''
  }];

  public set: string = 'PAL';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Tarountula';
  public fullName: string = 'Tarountula PAL';
}