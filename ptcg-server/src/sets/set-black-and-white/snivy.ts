import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Snivy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Tackle',
      cost: [G],
      damage: 10,
      text: ''
    },
    {
      name: 'Vine Whip',
      cost: [G, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Snivy';
  public fullName: string = 'Snivy BLW 1';
}
