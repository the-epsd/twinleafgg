import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';

export class Toedscool extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType = G;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Ram',
      cost: [G],
      damage: 10,
      text: ''
    },
    {
      name: 'Gentle Slap',
      cost: [G, C],
      damage: 20,
      text: ''
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Toedscool';
  public fullName: string = 'Toedscool SCR';
} 