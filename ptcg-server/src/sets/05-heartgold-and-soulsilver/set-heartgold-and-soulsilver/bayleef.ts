import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Bayleef extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Chikorita';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Hammer In',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Razor Leaf',
    cost: [G, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'HS';
  public setNumber: string = '35';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bayleef';
  public fullName: string = 'Bayleef HS';
}
