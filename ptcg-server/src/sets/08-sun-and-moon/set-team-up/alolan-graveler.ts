import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class AlolanGraveler extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Alolan Geodude';
  public cardType: CardType = L;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Rollout',
    cost: [],
    damage: 30,
    text: ''
  },
  {
    name: 'Electroslug',
    cost: [L, C, C, C],
    damage: 100,
    text: ''
  }];

  public set: string = 'TEU';
  public setNumber: string = '36';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Alolan Graveler';
  public fullName: string = 'Alolan Graveler TEU';
}
