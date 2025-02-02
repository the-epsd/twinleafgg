import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Rookidee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 60;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Flap',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: ''
    },
    {
      name: 'Glide',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'SHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Rookidee';
  public fullName: string = 'Rookidee SHF';
}
