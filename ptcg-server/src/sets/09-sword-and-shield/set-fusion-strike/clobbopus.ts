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
    damage: 10,
    text: ''
  },
  {
    name: 'Knuckle Punch',
    cost: [F, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '152';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Clobbopus';
  public fullName: string = 'Clobbopus FST 152';
}
