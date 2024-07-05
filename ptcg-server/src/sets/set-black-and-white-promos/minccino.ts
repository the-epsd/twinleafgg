import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Minccino extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 50;

  public weakness = [{ type: CardType.FIGHTING, value: 2 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Gnaw',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: ''
    },
    {
      name: 'Tail Smack',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'BWP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '13'; // Set the appropriate set number

  public name: string = 'Minccino';

  public fullName: string = 'Minccino BWP';
}
