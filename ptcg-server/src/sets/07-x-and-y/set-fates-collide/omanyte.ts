import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Omanyte extends PokemonCard {
  public stage: Stage = Stage.RESTORED;
  public evolvesFrom = 'Helix Fossil Omanyte';
  public cardType: CardType[] = [W];
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Water Gun',
    cost: [W],
    damage: 30,
    text: ''
  }];

  public set: string = 'FCO';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Omanyte';
  public fullName: string = 'Omanyte FCO';
}
