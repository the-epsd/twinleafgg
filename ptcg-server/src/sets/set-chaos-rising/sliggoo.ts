import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game';

export class Sliggoo extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Goomy';
  public hp: number = 90;
  public cardType: CardType = N;
  public weakness: { type: CardType }[] = [];
  public resistance: { type: CardType; value: number }[] = [];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Gentle Slap',
    cost: [W, P],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name: string = 'Sliggoo';
  public fullName: string = 'Sliggoo M4';
}
