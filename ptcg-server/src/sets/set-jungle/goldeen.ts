import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Goldeen extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 40;

  public weakness = [{ type: CardType.FIRE }];

  public attacks = [{
    name: 'Horn Attack',
    cost: [CardType.WATER],
    damage: 10,
    text: ''
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '53';

  public name: string = 'Goldeen';

  public fullName: string = 'Goldeen JU';

}