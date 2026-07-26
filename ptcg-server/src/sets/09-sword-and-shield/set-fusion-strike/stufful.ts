import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Stufful extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Beat',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Rollout',
    cost: [F, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '150';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Stufful';
  public fullName: string = 'Stufful FST 150';
}
