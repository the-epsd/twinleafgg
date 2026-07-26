import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Floatzel extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Buizel';
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Surf',
    cost: [W],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'SHF';
  public setNumber: string = '23';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Floatzel';
  public fullName: string = 'Floatzel SHF';
}
