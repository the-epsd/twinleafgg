import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Yanma extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Cutting Wind',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'UNM';
  public setNumber: string = '2';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Yanma';
  public fullName: string = 'Yanma UNM';
}
