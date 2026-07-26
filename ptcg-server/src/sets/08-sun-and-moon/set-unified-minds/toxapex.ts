import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Toxapex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Mareanie';
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Spike Shot',
    cost: [P, P],
    damage: 70,
    text: ''
  }];

  public set: string = 'UNM';
  public setNumber: string = '97';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Toxapex';
  public fullName: string = 'Toxapex UNM';
}
