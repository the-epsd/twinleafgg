import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Frogadier extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Froakie';
  public cardType: CardType[] = [W];
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Cut',
    cost: [C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'BKT';
  public setNumber: string = '47';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Frogadier';
  public fullName: string = 'Frogadier BKT';
}
