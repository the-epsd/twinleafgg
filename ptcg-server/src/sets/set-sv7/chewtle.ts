import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Chewtle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 80;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Headbutt',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public name: string = 'Chewtle';
  public fullName: string = 'Chewtle SV7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';
}
