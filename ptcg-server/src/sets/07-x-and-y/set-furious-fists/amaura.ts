import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Amaura extends PokemonCard {
  public stage: Stage = Stage.RESTORED;
  public evolvesFrom = 'Sail Fossil';
  public cardType: CardType[] = [W];
  public hp: number = 90;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Stampede',
    cost: [W],
    damage: 20,
    text: ''
  },
  {
    name: 'Aurora Beam',
    cost: [W, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'FFI';
  public setNumber: string = '25';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Amaura';
  public fullName: string = 'Amaura FFI';
}
