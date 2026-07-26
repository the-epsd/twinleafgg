import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Barraskewda extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Arrokuda';
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Pierce',
    cost: [W],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '83';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Barraskewda';
  public fullName: string = 'Barraskewda FST 83';
}
