import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Tepig extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [R];
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Live Coal',
    cost: [R],
    damage: 10,
    text: ''
  },
  {
    name: 'Rollout',
    cost: [R, C, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '31';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tepig';
  public fullName: string = 'Tepig CEC';
}
