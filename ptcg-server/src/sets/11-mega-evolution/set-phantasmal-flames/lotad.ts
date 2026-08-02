import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Lotad extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Headbutt',
    cost: [G, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public setNumber: string = '5';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lotad';
  public fullName: string = 'Lotad M2';
}
