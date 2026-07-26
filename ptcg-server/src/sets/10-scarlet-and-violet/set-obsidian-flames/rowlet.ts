import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Rowlet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Razor Wing',
    cost: [G],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'OBF';
  public setNumber: string = '13';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rowlet';
  public fullName: string = 'Rowlet OBF';
}
