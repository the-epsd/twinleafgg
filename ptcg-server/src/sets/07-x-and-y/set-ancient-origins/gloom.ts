import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Gloom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Oddish';
  public cardType: CardType[] = [G];
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Drool',
    cost: [G, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'AOR';
  public setNumber: string = '2';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gloom';
  public fullName: string = 'Gloom AOR';
}
