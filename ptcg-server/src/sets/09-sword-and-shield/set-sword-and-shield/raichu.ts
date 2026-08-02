import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Raichu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Pikachu';
  public cardType: CardType = L;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Pain-Full Punch',
    cost: [C],
    damage: 40,
    text: ''
  },
  {
    name: 'Mach Bolt',
    cost: [L, L, C],
    damage: 120,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'SSH';
  public setNumber: string = '66';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Raichu';
  public fullName: string = 'Raichu SSH';
}
