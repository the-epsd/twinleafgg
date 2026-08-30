import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Golurk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Golett';
  public cardType: CardType[] = [P];
  public hp: number = 150;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Dynamic Chop',
    cost: [P, C, C],
    damage: 80,
    text: ''
  },
  {
    name: 'Golurk Hammer',
    cost: [P, C, C, C, C],
    damage: 180,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'DAA';
  public setNumber: string = '77';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Golurk';
  public fullName: string = 'Golurk DAA';
}
