import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Sliggoo extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Goomy';
  public cardType: CardType[] = [N];
  public hp: number = 90;
  public weakness = [];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Gentle Slap',
    cost: [W, P],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public setNumber: string = '67';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sliggoo';
  public fullName: string = 'Sliggoo M4';
}
