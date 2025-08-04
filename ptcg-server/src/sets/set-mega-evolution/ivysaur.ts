import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Ivysaur extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Bulbasaur';
  public cardType: CardType = G;
  public hp: number = 110;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Razor Leaf',
    cost: [G, G],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'M1L';
  public setNumber: string = '2';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ivysaur';
  public fullName: string = 'Ivysaur M1L';

} 