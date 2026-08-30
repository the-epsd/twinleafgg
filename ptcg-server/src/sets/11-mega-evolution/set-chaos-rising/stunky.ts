import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Stunky extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [D];
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Scratch',
    cost: [D],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public setNumber: string = '53';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Stunky';
  public fullName: string = 'Stunky M4';
}
