import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Sharpedo extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Carvanha';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [];

  public attacks = [
    {
      name: 'Jet Headbutt',
      cost: [W, C],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'GRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Sharpedo';
  public fullName: string = 'Sharpedo GRI';

}
