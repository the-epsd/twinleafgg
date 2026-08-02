import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Pidgey extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Gust',
    cost: [C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public setNumber: string = '162';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pidgey';
  public fullName: string = 'Pidgey OBF';
}
