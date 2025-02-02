import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Mareep extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Static Shock',
      cost: [ CardType.LIGHTNING ],
      damage: 10,
      text: ''
    },
    {
      name: 'Electro Ball',
      cost: [ CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '66';

  public name: string = 'Mareep';

  public fullName: string = 'Mareep SVI';

}