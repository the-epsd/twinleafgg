import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class HisuianQwilfish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 80;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Ram',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: ''
  },
  {
    name: 'Rolling Tackle',
    cost: [CardType.DARK, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public set: string = 'ASR';
  public setNumber: string = '88';
  public regulationMark: string = 'F';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hisuian Qwilfish';
  public fullName: string = 'Hisuian Qwilfish ASR';
}