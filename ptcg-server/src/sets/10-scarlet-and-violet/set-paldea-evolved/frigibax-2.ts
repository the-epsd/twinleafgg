import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Frigibax2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Chilly',
    cost: [W],
    damage: 10,
    text: ''
  },
  {
    name: 'Bite',
    cost: [W, W, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'PAL';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Frigibax';
  public fullName: string = 'Frigibax PAL2';
}
