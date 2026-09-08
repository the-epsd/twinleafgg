import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Gabite extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Gible';
  public cardType: CardType[] = [F];
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Corkscrew Punch',
    cost: [F],
    damage: 20,
    text: ''
  },
  {
    name: 'Sharp Scythe',
    cost: [F, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'UNM';
  public setNumber: string = '113';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gabite';
  public fullName: string = 'Gabite UNM';
}
