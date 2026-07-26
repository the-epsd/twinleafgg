import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Eevee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Gnaw',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Tail Whap',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'VIV';
  public setNumber: string = '130';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Eevee';
  public fullName: string = 'Eevee VIV';
}
