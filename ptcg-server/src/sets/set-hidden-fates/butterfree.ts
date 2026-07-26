import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Butterfree extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Metapod';
  public cardType: CardType = G;
  public hp: number = 130;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Gust',
    cost: [G, C],
    damage: 80,
    text: ''
  }];

  public set: string = 'HIF';
  public setNumber: string = '3';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Butterfree';
  public fullName: string = 'Butterfree HIF';
}
