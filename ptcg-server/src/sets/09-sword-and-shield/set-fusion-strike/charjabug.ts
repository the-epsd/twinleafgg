import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Charjabug extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Grubbin';
  public cardType: CardType[] = [L];
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Vise Grip',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Head Bolt',
    cost: [L, C, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '100';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Charjabug';
  public fullName: string = 'Charjabug FST 100';
}
