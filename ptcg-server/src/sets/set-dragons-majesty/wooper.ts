import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Wooper extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 70;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Ram',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: ''
  },
  {
    name: 'Rain Splash',
    cost: [CardType.WATER, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];

  public set: string = 'DRM';
  public fullName: string = 'Wooper DRM';
  public name: string = 'Wooper';
  public setNumber: string = '25';
  public cardImage: string = 'assets/cardback.png';
}