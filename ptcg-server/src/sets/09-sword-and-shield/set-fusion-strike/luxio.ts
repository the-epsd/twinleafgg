import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Luxio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shinx';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Electric Claws',
    cost: [L, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '92';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Luxio';
  public fullName: string = 'Luxio FST 92';
}
