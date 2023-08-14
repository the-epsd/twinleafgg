import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';


export class Alakazamex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 310;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Mind Jack',
      cost: [ CardType.COLORLESS ],
      damage: 90,
      text: ''
    },
    {
      name: 'Dimensional Manipulation',
      cost: [ CardType.COLORLESS ],
      damage: 120,
      text: 'You may use this attack even if this Pokemon is on the Bench.'
    }
  ];

  public set: string = '151';

  public name: string = 'Alakazam ex';

  public fullName: string = 'Alakazam ex MEW 065';

}
