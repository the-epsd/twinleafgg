import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Timburr extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Low Kick',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Hammer In',
      cost: [F, C, C],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Timburr';
  public fullName: string = 'Timburr DEX';
}
