import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Metang extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Beldum';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Psypunch',
    cost: [P],
    damage: 30,
    text: ''
  },
  {
    name: 'Zen Headbutt',
    cost: [P, P],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'JTG';
  public setNumber: string = '62';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Metang';
  public fullName: string = 'Metang JTG';
}
