import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Vullaby extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Flap',
    cost: [D],
    damage: 10,
    text: ''
  },
  {
    name: 'Gust',
    cost: [D, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'PBL';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vullaby';
  public fullName: string = 'Vullaby M5';
}
