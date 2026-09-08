import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Kirlia extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Ralts';
  public cardType: CardType[] = [Y];
  public hp: number = 80;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Smack',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Magical Shot',
    cost: [Y, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'HIF';
  public setNumber: string = 'SV35';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kirlia';
  public fullName: string = 'Kirlia HIF';
}
