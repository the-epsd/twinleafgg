import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

// why was this played an actually good amount
export class Onix extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 120;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    { name: 'Land Crush', cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], damage: 120, text: '' }
  ];

  public set: string = 'LOT';

  public setNumber = '109';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Onix';

  public fullName: string = 'Onix LOT';

}
