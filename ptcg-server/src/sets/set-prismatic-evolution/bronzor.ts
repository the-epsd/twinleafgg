import { Stage, CardType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Bronzor extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = M;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Hammer In',
    cost: [M, C],
    damage: 20,
    text: ''
  }];

  public regulationMark: string = 'H';
  public set: string = 'PRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Bronzor';
  public fullName: string = 'Bronzor PRE';
}
