import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game';

export class Sliggoo extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Goomy';
  public hp: number = 90;
  public cardType: CardType = N;
  public weakness = [];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Gentle Slap',
      cost: [W, P],
      damage: 70,
      text: '',
    },
  ];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Sliggoo';
  public fullName: string = 'Sliggoo M4';
}
