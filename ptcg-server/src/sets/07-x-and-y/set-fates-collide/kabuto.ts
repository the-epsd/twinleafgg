import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Kabuto extends PokemonCard {
  public stage: Stage = Stage.RESTORED;
  public evolvesFrom = 'Dome Fossil Kabuto';
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Mud Shot',
    cost: [F],
    damage: 30,
    text: ''
  }];

  public set: string = 'FCO';
  public setNumber: string = '38';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kabuto';
  public fullName: string = 'Kabuto FCO';
}
