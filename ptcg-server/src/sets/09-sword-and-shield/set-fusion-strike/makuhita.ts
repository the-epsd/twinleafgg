import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class Makuhita extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.SINGLE_STRIKE];
  public cardType: CardType[] = [F];
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Lunge Out',
      cost: [C],
      damage: 10,
      text: '',
    },
    {
      name: 'Hammer In',
      cost: [F, C, C],
      damage: 60,
      text: '',
    },
  ];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '142';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Makuhita';
  public fullName: string = 'Makuhita FST 142';
}
