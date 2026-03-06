import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game';

export class Remoraid extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = W;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Slice Fin',
    cost: [W],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';
  public name: string = 'Remoraid';
  public fullName: string = 'Remoraid M4';
}
