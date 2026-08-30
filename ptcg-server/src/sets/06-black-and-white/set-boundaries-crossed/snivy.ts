import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Snivy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Vine Whip',
    cost: [G],
    damage: 10,
    text: ''
  },
  {
    name: 'Cut',
    cost: [G, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'BCR';
  public setNumber: string = '11';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Snivy';
  public fullName: string = 'Snivy BCR';
}
