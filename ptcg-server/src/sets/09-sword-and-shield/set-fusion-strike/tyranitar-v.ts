import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class TyranitarV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.POKEMON_V];
  public cardType: CardType[] = [D];
  public hp: number = 230;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Hammer In',
      cost: [D, C, C],
      damage: 80,
      text: '',
    },
    {
      name: 'Land Crush',
      cost: [D, D, D, C],
      damage: 150,
      text: '',
    },
  ];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '158';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tyranitar V';
  public fullName: string = 'Tyranitar V FST 158';
}
