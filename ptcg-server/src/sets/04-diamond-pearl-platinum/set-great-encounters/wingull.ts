import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';

export class Wingull extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +10 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Water Drip',
    cost: [W],
    damage: 10,
    text: ''
  },
{
    name: 'Wing Attack',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';
  public name: string = 'Wingull';
  public fullName: string = 'Wingull GE';
}
