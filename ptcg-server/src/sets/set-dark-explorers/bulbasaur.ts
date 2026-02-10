import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Bulbasaur extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.WATER, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Tackle',
      cost: [CardType.GRASS],
      damage: 10,
      text: ''
    },
    {
      name: 'Razor Leaf',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'DEX';

  public setNumber: string = '1';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Bulbasaur';

  public fullName: string = 'Bulbasaur DEX';

}
