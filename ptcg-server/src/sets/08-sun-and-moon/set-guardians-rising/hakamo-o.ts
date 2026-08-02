import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class HakamoO extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Jangmo-o';
  public cardType: CardType = N;
  public hp: number = 90;
  public weakness = [{ type: Y }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Headbutt',
    cost: [C],
    damage: 30,
    text: ''
  },
  {
    name: 'Dragon Claw',
    cost: [L, F, C],
    damage: 80,
    text: ''
  }];

  public set: string = 'GRI';
  public setNumber: string = '99';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hakamo-o';
  public fullName: string = 'Hakamo-o GRI';
}
