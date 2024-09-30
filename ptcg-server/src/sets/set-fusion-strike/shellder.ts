import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Shellder extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 70;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Toungue Slap',
    cost: [CardType.WATER],
    damage: 10,
    text: ''
  },
  {
    name: 'Wave Splash',
    cost: [CardType.WATER, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];

  public set: string = 'FST';
  public regulationMark: string = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'Shellder';
  public fullName: string = 'Shellder FST';
}