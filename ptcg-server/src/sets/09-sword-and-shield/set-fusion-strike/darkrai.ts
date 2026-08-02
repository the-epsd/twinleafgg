import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Darkrai extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 110;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Dark Cutter',
    cost: [D, C, C],
    damage: 90,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '167';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Darkrai';
  public fullName: string = 'Darkrai FST 167';
}
