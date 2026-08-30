import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Quagsire extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Wooper';
  public cardType: CardType[] = [F];
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Water Gun',
    cost: [W],
    damage: 20,
    text: ''
  },
  {
    name: 'Surf',
    cost: [W, W, W],
    damage: 120,
    text: ''
  }];

  public set: string = 'UNB';
  public setNumber: string = '97';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Quagsire';
  public fullName: string = 'Quagsire UNB';
}
