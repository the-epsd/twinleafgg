import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Pawniard extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [D];
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Stampede',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Ram',
    cost: [D, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'SVI';
  public setNumber: string = '132';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pawniard';
  public fullName: string = 'Pawniard SVI';
}
