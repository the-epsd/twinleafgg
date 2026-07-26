import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Chinchou extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Gentle Slap',
    cost: [C, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'SSH';
  public setNumber: string = '67';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Chinchou';
  public fullName: string = 'Chinchou SSH';
}
