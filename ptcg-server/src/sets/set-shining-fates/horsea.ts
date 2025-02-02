import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Horsea extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 40;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [];

  public attacks = [
    {
      name: 'Water Gun',
      cost: [CardType.WATER],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'SHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Horsea';
  public fullName: string = 'Horsea SHF';
}
