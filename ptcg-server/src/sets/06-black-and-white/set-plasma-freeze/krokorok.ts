import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Krokorok extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Sandile';
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Bite',
    cost: [D],
    damage: 20,
    text: ''
  },
  {
    name: 'Corkscrew Punch',
    cost: [D, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'PLF';
  public setNumber: string = '69';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Krokorok';
  public fullName: string = 'Krokorok PLF';
}
