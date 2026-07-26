import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class HisuianQwilfish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Ram',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Rolling Tackle',
    cost: [D, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'ASR';
  public setNumber: string = '88';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hisuian Qwilfish';
  public fullName: string = 'Hisuian Qwilfish ASR';
}
