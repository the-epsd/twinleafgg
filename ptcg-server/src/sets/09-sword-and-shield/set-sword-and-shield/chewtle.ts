import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Chewtle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Bite',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Water Gun',
    cost: [W, C, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'SSH';
  public setNumber: string = '60';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Chewtle';
  public fullName: string = 'Chewtle SSH';
}
