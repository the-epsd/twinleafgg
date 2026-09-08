import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class LucarioV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.POKEMON_V];
  public cardType: CardType[] = [F];
  public hp: number = 210;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Aura Sphere',
      cost: [F, F, C],
      damage: 120,
      text: '',
    },
  ];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '146';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lucario V';
  public fullName: string = 'Lucario V FST 146';
}
