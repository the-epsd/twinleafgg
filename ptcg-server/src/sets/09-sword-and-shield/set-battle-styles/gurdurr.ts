import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Gurdurr extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Timburr';
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Pound',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Hammer In',
    cost: [F, C, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'BST';
  public setNumber: string = '74';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gurdurr';
  public fullName: string = 'Gurdurr BST';
}
