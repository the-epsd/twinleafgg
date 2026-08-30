import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Tepig extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [R];
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [R],
    damage: 10,
    text: ''
  },
  {
    name: 'Rollout',
    cost: [R, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'BLW';
  public setNumber: string = '15';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tepig';
  public fullName: string = 'Tepig BLW';
}
