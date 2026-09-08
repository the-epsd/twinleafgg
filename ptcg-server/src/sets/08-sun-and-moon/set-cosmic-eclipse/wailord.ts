import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Wailord extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Wailmer';
  public cardType: CardType[] = [W];
  public hp: number = 200;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Heavy Impact',
    cost: [W, C, C],
    damage: 90,
    text: ''
  },
  {
    name: 'Hydro Splash',
    cost: [W, W, C, C],
    damage: 140,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '46';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wailord';
  public fullName: string = 'Wailord CEC';
}
