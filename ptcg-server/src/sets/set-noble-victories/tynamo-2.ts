import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Tynamo2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 30;
  public weakness = [{ type: CardType.FIGHTING }];

  public attacks = [{
    name: 'Tackle',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: ''
  }];

  public set: string = 'NVI';
  public name: string = 'Tynamo';
  public fullName: string = 'Tynamo NVI 39';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
}