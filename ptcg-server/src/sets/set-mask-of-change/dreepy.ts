import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';


export class Dreepy extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 70;

  public weakness = [];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Slight Jealousy',
      cost: [ CardType.PSYCHIC ],
      damage: 10,
      text: ''
    },
    {
      name: 'Bite',
      cost: [ CardType.FIRE, CardType.PSYCHIC ],
      damage: 40,
      text: ''
    }

  ];

  public set: string = 'SV6';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '79';

  public name: string = 'Dreepy';

  public fullName: string = 'Dreepy SV6';

}