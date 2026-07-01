import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Charjabug extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Grubbin';
  public cardType: CardType = L;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Vise Grip',
    cost: [L],
    damage: 30,
    text: '',
  },
  {
    name: 'Ram',
    cost: [L, L],
    damage: 50,
    text: '',
  }];

  public set: string = 'M5';
  public setNumber: string = '24';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Charjabug';
  public fullName: string = 'Charjabug M5';
}
