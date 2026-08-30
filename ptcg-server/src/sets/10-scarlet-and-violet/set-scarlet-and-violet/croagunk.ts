import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Croagunk extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [D];
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Beat',
    cost: [D],
    damage: 10,
    text: ''
  },
  {
    name: 'Whap Down',
    cost: [D, C, C],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'SVI';
  public setNumber: string = '130';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Croagunk';
  public fullName: string = 'Croagunk SVI';
}
