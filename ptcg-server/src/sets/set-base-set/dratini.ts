import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Dratini extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 40;
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Pound',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'BS';
  public setNumber: string = '26';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dratini';
  public fullName: string = 'Dratini BS';
}
