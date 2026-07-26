import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Lairon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Aron';
  public cardType: CardType = M;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Tackle',
    cost: [M, C, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Metal Claw',
    cost: [M, M, C, C],
    damage: 90,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'CRE';
  public setNumber: string = '110';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lairon';
  public fullName: string = 'Lairon CRE';
}
