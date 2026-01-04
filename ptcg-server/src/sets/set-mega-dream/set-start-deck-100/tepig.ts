import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Tepig extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: '',
    cost: [R],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'MC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';
  public name: string = 'Tepig';
  public fullName: string = 'Tepig MC';
}