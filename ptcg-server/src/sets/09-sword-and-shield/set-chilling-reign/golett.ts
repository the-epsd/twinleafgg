import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Golett extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Pound',
    cost: [P],
    damage: 10,
    text: ''
  },
  {
    name: 'Punch',
    cost: [P, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'CRE';
  public setNumber: string = '65';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Golett';
  public fullName: string = 'Golett CRE';
}
