import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Bruxish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Bite',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Surf',
    cost: [W, W, C],
    damage: 110,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'BST';
  public setNumber: string = '43';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bruxish';
  public fullName: string = 'Bruxish BST';
}
