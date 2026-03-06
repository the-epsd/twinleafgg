import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game';

export class Stunky extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = D;
  public weakness = [{ type: F }];
  public retreat = [C, C];
  public attacks = [{
    name: 'Scratch',
    cost: [D],
    damage: 20,
    text: ''
  }];
  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Stunky';
  public fullName: string = 'Stunky M4';
}
