import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Torchic extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Scratch',
    cost: [R, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'JTG';
  public setNumber: string = '22';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Torchic';
  public fullName: string = 'Torchic JTG';
}
