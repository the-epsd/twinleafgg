import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Raboot extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Scorbunny';
  public cardType: CardType = CardType.FIRE;
  public hp: number = 90;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Low Sweep',
      cost: [CardType.FIRE],
      damage: 30,
      text: ''
    },
    {
      name: 'Combustion',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      text: ''
    }
  ];
  public regulationMark = 'H';
  public set: string = 'SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Raboot';
  public fullName: string = 'Raboot SV7';
}
