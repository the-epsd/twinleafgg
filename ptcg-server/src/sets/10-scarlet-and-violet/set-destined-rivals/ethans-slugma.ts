import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class EthansSlugma extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.ETHANS];
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Steady Firebreathing',
      cost: [R],
      damage: 20,
      text: '',
    },
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '35';
  public cardImage: string = 'assets/cardback.png';
  public name: string = "Ethan's Slugma";
  public fullName: string = "Ethan's Slugma DRI";
}
