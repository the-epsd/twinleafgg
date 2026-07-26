import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Trevenant extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Phantump';
  public cardType: CardType = G;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Gentle Slap',
    cost: [G, C],
    damage: 40,
    text: ''
  },
  {
    name: 'Wood Hammer',
    cost: [G, C, C],
    damage: 90,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Trevenant';
  public fullName: string = 'Trevenant FST 17';
}
