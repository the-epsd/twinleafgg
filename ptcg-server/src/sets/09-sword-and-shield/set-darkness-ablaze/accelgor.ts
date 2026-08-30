import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Accelgor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shelmet';
  public cardType: CardType[] = [G];
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [];

  public attacks = [{
    name: 'Jet Headbutt',
    cost: [C, C],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'DAA';
  public setNumber: string = '10';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Accelgor';
  public fullName: string = 'Accelgor DAA';
}
