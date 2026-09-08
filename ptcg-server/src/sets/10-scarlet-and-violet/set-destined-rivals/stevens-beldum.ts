import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class StevensBeldum extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.STEVENS];
  public cardType: CardType[] = [M];
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Metal Slash',
      cost: [M, C],
      damage: 30,
      text: '',
    },
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '143';
  public cardImage: string = 'assets/cardback.png';
  public name: string = "Steven's Beldum";
  public fullName: string = "Steven's Beldum DRI";
}
