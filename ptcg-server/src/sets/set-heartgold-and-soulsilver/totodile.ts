import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Totodile extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Gnaw',
    cost: [W],
    damage: 10,
    text: ''
  },
  {
    name: 'Wave Splash',
    cost: [W, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';
  public name: string = 'Totodile';
  public fullName: string = 'Totodile HS';
}