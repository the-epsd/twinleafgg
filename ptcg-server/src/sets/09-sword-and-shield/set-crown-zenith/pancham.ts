import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Pancham extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Chop',
    cost: [C, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'CRZ';
  public setNumber: string = '72';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pancham';
  public fullName: string = 'Pancham CRZ 72';
}
