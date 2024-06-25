import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Hitmonchan extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 70;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Jab',
      cost: [CardType.FIGHTING],
      damage: 20,
      text: ''
    },
    {
      name: 'Special Punch',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '7';

  public name: string = 'Hitmonchan';

  public fullName: string = 'Hitmonchan BS';

}