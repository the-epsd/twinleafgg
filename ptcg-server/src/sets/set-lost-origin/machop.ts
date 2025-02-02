import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
export class Machop extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 70;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Punch',
      cost: [CardType.FIGHTING],
      damage: 20,
      text: ''
    }];

  public regulationMark: string = 'f';
  public set: string = 'LOR';
  public name: string = 'Machop';
  public fullName: string = 'Machop LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';

}