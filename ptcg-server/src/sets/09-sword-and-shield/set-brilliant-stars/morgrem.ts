import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Morgrem extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Impidimp';
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Smash Kick',
    cost: [D],
    damage: 30,
    text: ''
  },
  {
    name: 'Pierce',
    cost: [D, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'BRS';
  public setNumber: string = '93';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Morgrem';
  public fullName: string = 'Morgrem BRS 93';
}
