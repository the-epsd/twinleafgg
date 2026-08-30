import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Haunter extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Gastly';
  public cardType: CardType[] = [P];
  public hp: number = 80;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Will-O-Wisp',
    cost: [P],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'CRE';
  public setNumber: string = '56';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Haunter';
  public fullName: string = 'Haunter CRE';
}
