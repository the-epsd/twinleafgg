import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';

export class Slurpuff extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Swirlix';
  public hp: number = 120;
  public cardType: CardType = P;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Tackle',
    cost: [P],
    damage: 40,
    text: ''
  },
  {
    name: 'Magical Shot',
    cost: [P, C],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name: string = 'Slurpuff';
  public fullName: string = 'Slurpuff ASC';
}
