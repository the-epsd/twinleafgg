import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Joltik extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 30;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Ram',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Bug Bite',
      cost: [C, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '41';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Joltik';
  public fullName: string = 'Joltik DEX';
}
