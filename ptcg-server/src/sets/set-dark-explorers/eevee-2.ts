import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Eevee2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Smash Kick',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Tail Whap',
      cost: [C, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '84';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Eevee';
  public fullName: string = 'Eevee DEX 84';
}
