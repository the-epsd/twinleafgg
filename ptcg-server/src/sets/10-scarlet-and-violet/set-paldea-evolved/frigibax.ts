import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Frigibax extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [W, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'PAL';
  public setNumber: string = '57';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Frigibax';
  public fullName: string = 'Frigibax PAL1';
}
