import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class Shuppet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.SINGLE_STRIKE];
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Will-O-Wisp',
      cost: [P],
      damage: 20,
      text: '',
    },
  ];

  public regulationMark = 'E';
  public set: string = 'CRE';
  public setNumber: string = '62';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Shuppet';
  public fullName: string = 'Shuppet CRE';
}
