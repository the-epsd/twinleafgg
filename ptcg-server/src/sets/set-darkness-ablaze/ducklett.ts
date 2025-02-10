import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Ducklett extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = C;

  public hp: number = 50;

  public weakness = [{ type: L }];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Flap',
      cost: [C],
      damage: 20,
      text: ''
    },
  ];

  public regulationMark: string = 'D';
  public set: string = 'DAA';
  public setNumber: string = '148';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ducklett';
  public fullName: string = 'Ducklett DAA';

}