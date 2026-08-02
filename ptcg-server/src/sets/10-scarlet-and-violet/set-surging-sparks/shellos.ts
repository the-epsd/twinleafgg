import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Shellos extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Sprinkle Water',
    cost: [C, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '46';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Shellos';
  public fullName: string = 'Shellos SSP';
}
