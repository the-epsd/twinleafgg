import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Shuppet extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    { name: 'Headbutt', cost: [CardType.COLORLESS], damage: 10, text: '' },
    { name: 'Will-o-wisp', cost: [CardType.PSYCHIC, CardType.COLORLESS], damage: 20, text: '' }
  ];

  public set: string = 'CES';

  public setNumber: string = '63';

  public name: string = 'Shuppet';

  public fullName: string = 'Shuppet CES';

}
