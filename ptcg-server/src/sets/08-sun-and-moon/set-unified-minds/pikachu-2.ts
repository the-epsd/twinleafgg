import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Pikachu2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [L];
  public hp: number = 70;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Tail Whap',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Electric Ball',
    cost: [L, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'UNM';
  public setNumber: string = '56';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu UNM 56';
}
