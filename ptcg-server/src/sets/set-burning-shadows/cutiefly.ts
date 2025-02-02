import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Cutiefly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = Y;
  public hp: number = 30;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];

  public attacks = [{
    name: 'Fairy Wind',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';
  public name: string = 'Cutiefly';
  public fullName: string = 'Cutiefly BUS';
}