import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Snom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 50;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Sprinkle Water',
    cost: [W],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'SSH';
  public setNumber: string = '63';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Snom';
  public fullName: string = 'Snom SSH';
}
