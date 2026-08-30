import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class ArvensMaschiff extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.ARVENS];
  public cardType: CardType[] = [D];
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Stampede',
      cost: [C],
      damage: 10,
      text: '',
    },
    {
      name: 'Confront',
      cost: [C, C, C],
      damage: 50,
      text: '',
    },
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '138';
  public cardImage: string = 'assets/cardback.png';
  public name: string = "Arven's Maschiff";
  public fullName: string = "Arven's Maschiff DRI";
}
