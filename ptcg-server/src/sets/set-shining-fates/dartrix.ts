import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Dartrix extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Rowlet';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Razor Leaf',
    cost: [G],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'SHF';
  public setNumber: string = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dartrix';
  public fullName: string = 'Dartrix SHF';
}
