import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Dratini2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 70;
  public weakness = [{ type: Y }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Tail Whap',
    cost: [W, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'DRM';
  public setNumber: string = '35';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dratini';
  public fullName: string = 'Dratini DRM 35';
}
