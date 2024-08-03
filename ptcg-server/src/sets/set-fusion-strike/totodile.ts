import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Totodile extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 70;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Rain Splash',
      cost: [CardType.WATER],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Totodile';
  public fullName: string = 'Totodile FST';
}
