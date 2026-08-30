import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Houndour extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [D];
  public hp: number = 60;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Rear Kick',
    cost: [D],
    damage: 10,
    text: ''
  },
  {
    name: 'Darkness Fang',
    cost: [D, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'CIN';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Houndour';
  public fullName: string = 'Houndour CIN';
}
