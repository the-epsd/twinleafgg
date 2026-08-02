import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Corphish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Water Gun',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Crabhammer',
    cost: [W, C, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'BRS';
  public setNumber: string = '32';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Corphish';
  public fullName: string = 'Corphish BRS 32';
}
