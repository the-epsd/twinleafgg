import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Clobbopus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Beat',
    cost: [F],
    damage: 20,
    text: ''
  },
  {
    name: 'Hammer In',
    cost: [F, C],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'VIV';
  public setNumber: string = '100';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Clobbopus';
  public fullName: string = 'Clobbopus VIV';
}
