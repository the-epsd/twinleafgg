import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class Snover extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.SINGLE_STRIKE];
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Whap Down',
      cost: [G, C, C],
      damage: 60,
      text: '',
    },
  ];

  public regulationMark = 'E';
  public set: string = 'CRE';
  public setNumber: string = '9';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Snover';
  public fullName: string = 'Snover CRE';
}
