import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Prinplup extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Piplup';
  public cardType: CardType[] = [W];
  public hp: number = 90;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Peck',
    cost: [W],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'BRS';
  public setNumber: string = '36';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Prinplup';
  public fullName: string = 'Prinplup BRS 36';
}
