import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Nidorino extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Nidoran ♂';
  public cardType: CardType[] = [P];
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Peck',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Horn Drill',
    cost: [P, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'TEU';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Nidorino';
  public fullName: string = 'Nidorino TEU';
}
