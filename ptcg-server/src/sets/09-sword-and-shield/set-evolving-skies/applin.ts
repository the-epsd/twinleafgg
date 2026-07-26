import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Applin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Rollout',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'EVS';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Applin';
  public fullName: string = 'Applin EVS';
}
