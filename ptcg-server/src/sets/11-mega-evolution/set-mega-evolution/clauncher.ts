import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Clauncher extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Wave Splash',
    cost: [W, W],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'MEG';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Clauncher';
  public fullName: string = 'Clauncher M1S';
}
