import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Tangela extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Beat',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Vine Whip',
    cost: [G, G, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'CRZ';
  public setNumber: string = '4';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tangela';
  public fullName: string = 'Tangela CRZ 4';
}
