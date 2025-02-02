import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Larvitar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Headbutt',
      cost: [C],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'PRE';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Larvitar';
  public fullName: string = 'Larvitar PRE';
}
