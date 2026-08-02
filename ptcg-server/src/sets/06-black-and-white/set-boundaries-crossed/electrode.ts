import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Electrode extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Voltorb';
  public cardType: CardType = L;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Static Shock',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Electro Ball',
    cost: [L, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'BCR';
  public setNumber: string = '52';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Electrode';
  public fullName: string = 'Electrode BCR';
}
