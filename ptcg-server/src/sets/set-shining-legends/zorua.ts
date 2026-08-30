import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Zorua extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [D];
  public hp: number = 60;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [ C ];

  public attacks = [{
    name: 'Stampede',
    cost: [D],
    damage: 10,
    text: ''
  },
  {
    name: 'Ram',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'SLG';
  public setNumber: string = '52';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zorua';
  public fullName: string = 'Zorua SLG';
}
