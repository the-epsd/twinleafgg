import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Venonat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Gnaw',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Beam',
    cost: [G, C, C],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'MEW';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Venonat';
  public fullName: string = 'Venonat MEW';
}
