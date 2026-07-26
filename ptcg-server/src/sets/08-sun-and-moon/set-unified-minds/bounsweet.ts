import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Bounsweet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Splash',
    cost: [G],
    damage: 10,
    text: ''
  },
  {
    name: 'Spinning Attack',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'UNM';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bounsweet';
  public fullName: string = 'Bounsweet UNM';
}
