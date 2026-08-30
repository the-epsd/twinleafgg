import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Gligar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Slash',
    cost: [C, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'BST';
  public setNumber: string = '71';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gligar';
  public fullName: string = 'Gligar BST';
}
