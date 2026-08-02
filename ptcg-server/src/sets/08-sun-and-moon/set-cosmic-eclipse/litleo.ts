import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Litleo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Tackle',
    cost: [R],
    damage: 10,
    text: ''
  },
  {
    name: 'Flame Tail',
    cost: [R, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '36';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Litleo';
  public fullName: string = 'Litleo CEC';
}
