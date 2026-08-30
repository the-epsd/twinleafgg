import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Haunter extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Gastly';
  public cardType: CardType[] = [D];
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Hollow Shot',
    cost: [D],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public setNumber: string = '55';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Haunter';
  public fullName: string = 'Haunter MBG';
}
