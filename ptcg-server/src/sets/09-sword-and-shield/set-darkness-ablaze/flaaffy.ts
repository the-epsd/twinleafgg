import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Flaaffy extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Mareep';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Static Shock',
    cost: [L],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'DAA';
  public setNumber: string = '56';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Flaaffy';
  public fullName: string = 'Flaaffy DAA';
}
