import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Salazzle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Salandit';
  public cardType: CardType = R;
  public hp: number = 100;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Fire Claws',
    cost: [R, R],
    damage: 70,
    text: ''
  }];

  public set: string = 'UNM';
  public setNumber: string = '34';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Salazzle';
  public fullName: string = 'Salazzle UNM';
}
