import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Rhyhorn2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Horn Attack',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Boulder Crush',
    cost: [F, C, C, C],
    damage: 80,
    text: ''
  }];

  public set: string = 'UNB';
  public setNumber: string = '93';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rhyhorn';
  public fullName: string = 'Rhyhorn UNB 93';
}
