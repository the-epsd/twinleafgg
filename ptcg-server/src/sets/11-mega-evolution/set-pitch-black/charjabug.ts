import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Charjabug extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Grubbin';
  public cardType: CardType[] = [L];
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Vise Grip',
    cost: [L],
    damage: 30,
    text: ''
  },
  {
    name: 'Ram',
    cost: [L, L],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'PBL';
  public setNumber: string = '25';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Charjabug';
  public fullName: string = 'Charjabug M5';
}
