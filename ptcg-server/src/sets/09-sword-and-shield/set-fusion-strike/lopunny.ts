import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class Lopunny extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Buneary';
  protected _tags = [CardTag.RAPID_STRIKE];
  public cardType: CardType[] = [C];
  public hp: number = 110;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Hopping Shot',
      cost: [C, C],
      damage: 70,
      text: '',
    },
  ];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '213';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lopunny';
  public fullName: string = 'Lopunny FST 213';
}
