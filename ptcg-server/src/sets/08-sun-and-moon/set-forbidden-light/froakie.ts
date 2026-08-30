import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Froakie extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Rain Splash',
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

  public set: string = 'FLI';
  public setNumber: string = '22';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Froakie';
  public fullName: string = 'Froakie FLI';
}
