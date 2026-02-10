import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Bulbasaur extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = G;

  public hp: number = 60;

  public weakness = [{ type: R }];

  public resistance = [{ type: W, value: -20 }];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Tackle',
      cost: [G],
      damage: 10,
      text: ''
    },
    {
      name: 'Razor Leaf',
      cost: [G, C, C],
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
