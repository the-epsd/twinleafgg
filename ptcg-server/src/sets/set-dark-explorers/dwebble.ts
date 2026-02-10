import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Dwebble extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Beat',
      cost: [CardType.GRASS],
      damage: 10,
      text: ''
    },
    {
      name: 'Cut',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
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
