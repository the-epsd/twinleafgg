import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Scyther extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Slash',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Sharp Scythe',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'BCR';
  public setNumber: string = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Scyther';
  public fullName: string = 'Scyther BCR';
}
