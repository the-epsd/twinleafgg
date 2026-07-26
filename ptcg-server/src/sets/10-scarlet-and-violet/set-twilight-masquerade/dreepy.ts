import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Dreepy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 70;
  public weakness = [];
  public retreat = [C];

  public attacks = [{
    name: 'Petty Grudge',
    cost: [P],
    damage: 10,
    text: ''
  },
  {
    name: 'Bite',
    cost: [R, P],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public setNumber: string = '128';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dreepy';
  public fullName: string = 'Dreepy TWM';
}
