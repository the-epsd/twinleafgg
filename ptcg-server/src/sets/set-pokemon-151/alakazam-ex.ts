import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';


export class Alakazamex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 310;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Mind Jack',
      cost: [CardType.COLORLESS],
      damage: 90,
      text: ''
    },
    {
      name: 'Dimensional Manipulation',
      cost: [],
      damage: 120,
      useOnBench: true,
      text: 'You may use this attack even if this Pokemon is on the Bench.'
    }
  ];

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '65';

  public name: string = 'Alakazam ex';

  public fullName: string = 'Alakazam ex MEW';

}