import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Buizel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 60;
  public weakness = [{ type: L, value: 10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Headbutt',
    cost: [],
    damage: 10,
    text: ''
  },
  {
    name: 'Surf',
    cost: [W, W],
    damage: 30,
    text: ''
  }];

  public set: string = 'GE';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Buizel';
  public fullName: string = 'Buizel GE';
}
