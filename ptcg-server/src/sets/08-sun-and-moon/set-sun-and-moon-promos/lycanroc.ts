import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Lycanroc extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Rockruff';
  public cardType: CardType = F;
  public hp: number = 110;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Bite',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Claw Slash',
    cost: [F, F, C],
    damage: 80,
    text: ''
  }];

  public set: string = 'TK10L';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lycanroc';
  public fullName: string = 'Lycanroc TK10L';
}
