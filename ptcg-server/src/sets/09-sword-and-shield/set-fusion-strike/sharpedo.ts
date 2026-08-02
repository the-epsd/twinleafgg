import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Sharpedo extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Carvanha';
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Sharp Fang',
    cost: [D, C],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '163';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sharpedo';
  public fullName: string = 'Sharpedo FST 163';
}
