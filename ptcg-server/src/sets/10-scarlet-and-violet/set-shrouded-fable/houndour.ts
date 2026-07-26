import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Houndour extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Gnaw',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Rear Kick',
    cost: [R, C, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'SFA';
  public setNumber: string = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Houndour';
  public fullName: string = 'Houndour SFA';
}
