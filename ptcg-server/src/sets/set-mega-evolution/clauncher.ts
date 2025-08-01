import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Clauncher extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Wave Splash',
    cost: [W, W],
    damage: 50,
    text: ''
  }];

  public set: string = 'M1S';
  public name: string = 'Clauncher';
  public fullName: string = 'Clauncher M1S';
  public setNumber: string = '19';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
}