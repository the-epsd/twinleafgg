import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Golbat extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Zubat';
  public cardType: CardType[] = [D];
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Bite',
    cost: [D],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'SIT';
  public setNumber: string = '104';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Golbat';
  public fullName: string = 'Golbat SIT';
}
