import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Golett extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 90;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Pound',
      cost: [CardType.PSYCHIC],
      damage: 10,
      text: ''
    },
    {
      name: 'Punch',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '065';
  public name: string = 'Golett';
  public fullName: string = 'Golett CRE';
}