import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Palpitoad extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Tympole';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rain Splash',
    cost: [W, W],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public setNumber: string = '51';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Palpitoad';
  public fullName: string = 'Palpitoad OBF';
}
