import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Zorua extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    { name: 'Stampede', cost: [CardType.DARK], damage: 10, text: '' },
    { name: 'Ram', cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: '' }
  ];

  public set: string = 'SLG';

  public setNumber = '52';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Zorua';

  public fullName: string = 'Zorua SLG';

}
