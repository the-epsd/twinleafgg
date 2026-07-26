import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Honedge extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Cut Up',
    cost: [M],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'PAR';
  public setNumber: string = '130';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Honedge';
  public fullName: string = 'Honedge PAR';
}
