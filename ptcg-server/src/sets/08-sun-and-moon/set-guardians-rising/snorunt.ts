import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Snorunt extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Chilly',
    cost: [W],
    damage: 10,
    text: ''
  },
  {
    name: 'Frost Breath',
    cost: [W, W],
    damage: 20,
    text: ''
  }];

  public set: string = 'GRI';
  public setNumber: string = '31';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Snorunt';
  public fullName: string = 'Snorunt GRI';
}
