import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Dolliv extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Smoliv';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Leaf Step',
    cost: [G],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'MEM';
  public setNumber: string = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dolliv';
  public fullName: string = 'Dolliv MEM';
}
