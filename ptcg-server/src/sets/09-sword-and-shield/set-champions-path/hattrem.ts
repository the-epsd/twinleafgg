import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Hattrem extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Hatenna';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Beat',
    cost: [P],
    damage: 20,
    text: ''
  },
  {
    name: 'Super Psy Bolt',
    cost: [P, C],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'CPA';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hattrem';
  public fullName: string = 'Hattrem CPA';
}
