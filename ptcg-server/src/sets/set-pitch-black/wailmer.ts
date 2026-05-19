import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Wailmer extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Water Gun',
    cost: [W, W],
    damage: 40,
    text: '',
  },
  {
    name: 'Wave Splash',
    cost: [W, W, W],
    damage: 80,
    text: '',
  }];

  public set: string = 'M5';
  public setNumber: string = '14';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wailmer';
  public fullName: string = 'Wailmer M5';
}
