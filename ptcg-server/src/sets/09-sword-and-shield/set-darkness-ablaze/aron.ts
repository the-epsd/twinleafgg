import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Aron extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [M];
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Ram',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Headbutt',
    cost: [M, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'DAA';
  public setNumber: string = '121';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Aron';
  public fullName: string = 'Aron DAA';
}
