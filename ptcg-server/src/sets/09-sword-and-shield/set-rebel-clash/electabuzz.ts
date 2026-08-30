import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Electabuzz extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [L];
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Knuckle Punch',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Electroslug',
    cost: [L, L, C],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'RCL';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Electabuzz';
  public fullName: string = 'Electabuzz RCL';
}
