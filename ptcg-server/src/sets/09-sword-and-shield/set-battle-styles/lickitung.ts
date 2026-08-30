import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Lickitung extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 110;
  public weakness = [{ type: F }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Tongue Slap',
    cost: [C, C, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Hammer In',
    cost: [C, C, C, C],
    damage: 80,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'BST';
  public setNumber: string = '113';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lickitung';
  public fullName: string = 'Lickitung BST';
}
