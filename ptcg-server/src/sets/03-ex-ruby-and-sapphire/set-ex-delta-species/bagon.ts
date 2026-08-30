import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class Bagon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType[] = [R];
  public hp: number = 50;
  public weakness = [{ type: C }];
  public resistance = [
    { type: R, value: -30 },
    { type: F, value: -30 },
  ];
  public retreat = [C];

  public attacks = [
    {
      name: 'Bite',
      cost: [C],
      damage: 10,
      text: '',
    },
  ];

  public set: string = 'DS';
  public setNumber: string = '57';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bagon';
  public fullName: string = 'Bagon DS 57';
}
