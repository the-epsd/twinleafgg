import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Pawniard extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 70;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    { name: 'Stampede', cost: [CardType.COLORLESS], damage: 10, text: '' },
    { name: 'Ram', cost: [CardType.DARK, CardType.COLORLESS], damage: 20, text: '' }
  ];

  public set: string = 'SVI';

  public setNumber = '132';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Pawniard';

  public fullName: string = 'Pawniard SVI';

}
