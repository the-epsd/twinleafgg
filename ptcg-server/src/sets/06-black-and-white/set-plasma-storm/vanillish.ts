import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Vanillish extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Vanillite';
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Icy Snow',
    cost: [W, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'PLS';
  public setNumber: string = '36';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vanillish';
  public fullName: string = 'Vanillish PLS';
}
