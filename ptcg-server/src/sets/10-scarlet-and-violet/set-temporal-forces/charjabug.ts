import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Charjabug extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Grubbin';
  public cardType: CardType = L;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Static Shock',
    cost: [L, L],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'TEF';
  public setNumber: string = '55';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Charjabug';
  public fullName: string = 'Charjabug TEF';
}
