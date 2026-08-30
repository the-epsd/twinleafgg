import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Vibrava extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Trapinch';
  public cardType: CardType[] = [F];
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Razor Wing',
    cost: [F],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'BRS';
  public setNumber: string = '75';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vibrava';
  public fullName: string = 'Vibrava BRS 75';
}
