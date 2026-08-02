import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Spheal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Ice Ball',
    cost: [W, W],
    damage: 20,
    text: ''
  }];

  public set: string = 'FLF';
  public setNumber: string = '24';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Spheal';
  public fullName: string = 'Spheal FLF';
}
