import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Tarountula extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Hook',
    cost: [G, G],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'PAL';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tarountula';
  public fullName: string = 'Tarountula PAL';
}
