import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class Yveltal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.SINGLE_STRIKE];
  public cardType: CardType = D;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Dark Cutter',
      cost: [D, D],
      damage: 50,
      text: '   ',
    },
    {
      name: 'Single Strike Wings',
      cost: [D, D, D],
      damage: 110,
      text: '   ',
    },
  ];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '175';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Yveltal';
  public fullName: string = 'Yveltal FST';
}
