import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Lairon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Aron';
  public cardType: CardType = M;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Metal Claw',
    cost: [M],
    damage: 20,
    text: ''
  },
  {
    name: 'Hammer In',
    cost: [M, M, C, C],
    damage: 80,
    text: ''
  }];

  public set: string = 'CIN';
  public setNumber: string = '66';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lairon';
  public fullName: string = 'Lairon CIN';
}
