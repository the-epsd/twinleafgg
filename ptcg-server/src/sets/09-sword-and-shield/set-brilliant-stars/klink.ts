import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Klink extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Vise Grip',
    cost: [M],
    damage: 10,
    text: ''
  },
  {
    name: 'Spinning Attack',
    cost: [M, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'BRS';
  public setNumber: string = '102';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Klink';
  public fullName: string = 'Klink BRS 102';
}
