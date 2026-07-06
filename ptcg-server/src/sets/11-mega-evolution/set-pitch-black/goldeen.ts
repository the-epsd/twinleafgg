import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Goldeen extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Pierce',
    cost: [C, C],
    damage: 30,
    text: '',
  }];

  public set: string = 'M5';
  public setNumber: string = '12';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Goldeen';
  public fullName: string = 'Goldeen M5';
}
