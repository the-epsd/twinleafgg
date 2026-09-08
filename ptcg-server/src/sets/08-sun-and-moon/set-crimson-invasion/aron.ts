import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Aron extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [M];
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [M],
    damage: 10,
    text: ''
  },
  {
    name: 'Metal Claw',
    cost: [M, C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'CIN';
  public setNumber: string = '65';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Aron';
  public fullName: string = 'Aron CIN';
}
