import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Litten extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Bite',
    cost: [R],
    damage: 10,
    text: ''
  },
  {
    name: 'Flare',
    cost: [R, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'SUM';
  public setNumber: string = '24';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Litten';
  public fullName: string = 'Litten SUM';
}
