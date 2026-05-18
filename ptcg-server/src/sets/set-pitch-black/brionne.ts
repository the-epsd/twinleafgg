import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Brionne extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Popplio';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Hyper Voice',
    cost: [W],
    damage: 40,
    text: '',
  }];

  public set: string = 'M5';
  public setNumber: string = '18';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Brionne';
  public fullName: string = 'Brionne M5';
}
