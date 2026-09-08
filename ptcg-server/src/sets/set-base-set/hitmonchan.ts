import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Hitmonchan extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Jab',
    cost: [F],
    damage: 20,
    text: ''
  },
  {
    name: 'Special Punch',
    cost: [F, F, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'BS';
  public setNumber: string = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hitmonchan';
  public fullName: string = 'Hitmonchan BS';
}
