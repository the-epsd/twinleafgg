import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Noibat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [N];
  public hp: number = 60;
  public retreat = [C];

  public attacks = [{
    name: 'Flap',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Glide',
    cost: [P, D],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'SIT';
  public setNumber: string = '132';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Noibat';
  public fullName: string = 'Noibat SIT 132';
}
