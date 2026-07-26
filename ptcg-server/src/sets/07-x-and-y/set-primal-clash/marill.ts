import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Marill extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = Y;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Tackle',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Rollout',
    cost: [Y, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'PRC';
  public setNumber: string = '102';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Marill';
  public fullName: string = 'Marill PRC';
}
