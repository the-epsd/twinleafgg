import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Pupitar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Larvitar';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Sand Spray',
      cost: [C],
      damage: 20,
      text: ''
    },
    {
      name: 'Hammer In',
      cost: [C, C, C],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'PRE';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Pupitar';
  public fullName: string = 'Pupitar PRE';
}
