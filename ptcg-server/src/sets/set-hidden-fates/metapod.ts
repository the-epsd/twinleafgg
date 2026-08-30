import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Metapod extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Caterpie';
  public cardType: CardType[] = [G];
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Tackle',
    cost: [G, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'HIF';
  public setNumber: string = '2';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Metapod';
  public fullName: string = 'Metapod HIF';
}
