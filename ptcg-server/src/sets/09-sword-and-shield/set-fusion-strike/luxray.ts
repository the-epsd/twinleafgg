import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Luxray extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Luxio';
  public cardType: CardType[] = [L];
  public hp: number = 160;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Thunder Claws',
    cost: [L, C],
    damage: 90,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '93';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Luxray';
  public fullName: string = 'Luxray FST 93';
}
