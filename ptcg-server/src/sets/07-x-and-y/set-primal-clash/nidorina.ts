import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Nidorina extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Nidoran ♀';
  public cardType: CardType[] = [P];
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Scratch',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Strength',
    cost: [P, P, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'PRC';
  public setNumber: string = '67';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Nidorina';
  public fullName: string = 'Nidorina PRC';
}
