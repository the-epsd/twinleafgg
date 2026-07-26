import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Carvanha extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 50;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Ram',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Razor Fin',
    cost: [W, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'EVS';
  public setNumber: string = '35';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Carvanha';
  public fullName: string = 'Carvanha EVS';
}
