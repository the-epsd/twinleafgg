import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

/** Type: Null */
export class TypeNull extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Power Edge',
      cost: [C, C],
      damage: 40,
      text: '',
    },
  ];

  public set: string = 'PBL';
  public setNumber: string = '69';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Type: Null';
  public fullName: string = 'Type: Null M5';
}
