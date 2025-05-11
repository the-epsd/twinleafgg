
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Sealeo extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Spheal';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Lunge Out',
      cost: [W],
      damage: 30,
      text: ''
    },
    {
      name: 'Ice Ball',
      cost: [W, W],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'SSP';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Sealeo';
  public fullName: string = 'Sealeo SSP';

}