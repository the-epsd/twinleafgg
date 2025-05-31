import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Shuppet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Headbutt',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Will-o\'-the-wisp',
      cost: [P, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'LM';
  public setNumber: string = '63';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Shuppet';
  public fullName: string = 'Shuppet LM';
}