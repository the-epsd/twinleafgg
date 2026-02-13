import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Joltik2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 30;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Static Shock',
      cost: [L],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '42';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Joltik';
  public fullName: string = 'Joltik DEX 42';
}
