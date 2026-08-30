import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Lampent extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Litwick';
  public cardType: CardType[] = [R];
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Will-O-Wisp',
    cost: [R],
    damage: 30,
    text: ''
  }];

  public set: string = 'GRI';
  public setNumber: string = '12';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lampent';
  public fullName: string = 'Lampent GRI';
}
