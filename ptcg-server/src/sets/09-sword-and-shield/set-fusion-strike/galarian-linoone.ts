import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class GalarianLinoone extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Galarian Zigzagoon';
  public cardType: CardType[] = [D];
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Rear Kick',
    cost: [D],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '160';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Galarian Linoone';
  public fullName: string = 'Galarian Linoone FST';
}
