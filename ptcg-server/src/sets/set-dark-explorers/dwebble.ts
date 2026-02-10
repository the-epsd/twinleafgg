import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Dwebble extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = G;

  public hp: number = 60;

  public weakness = [{ type: R }];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Beat',
      cost: [G],
      damage: 10,
      text: ''
    },
    {
      name: 'Cut',
      cost: [G, C, C],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'DEX';

  public setNumber: string = '7';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Dwebble';

  public fullName: string = 'Dwebble DEX';

}
