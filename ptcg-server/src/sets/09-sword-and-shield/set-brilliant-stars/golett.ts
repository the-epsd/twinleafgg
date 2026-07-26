import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Golett extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Mud-Slap',
    cost: [F],
    damage: 10,
    text: ''
  },
  {
    name: 'Pound',
    cost: [F, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'BRS';
  public setNumber: string = '82';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Golett';
  public fullName: string = 'Golett BRS 82';
}
