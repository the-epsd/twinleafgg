import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Gabite extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Gible';
  public cardType: CardType = N;
  public hp: number = 90;
  public retreat = [C];

  public attacks = [{
    name: 'Dragon Claw',
    cost: [W, F],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'BRS';
  public setNumber: string = '108';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gabite';
  public fullName: string = 'Gabite BRS 108';
}
