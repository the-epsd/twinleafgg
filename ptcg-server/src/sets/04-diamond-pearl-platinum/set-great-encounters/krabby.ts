import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';

export class Krabby extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Irongrip',
    cost: [C],
    damage: 10,
    text: ''
  },
{
    name: 'Guillotine',
    cost: [W, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Krabby';
  public fullName: string = 'Krabby GE';
}
