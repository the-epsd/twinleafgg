import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Mareep extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];
  public attacks = [
    {
      name: 'Rear Kick',
      cost: [ CardType.COLORLESS ],
      damage: 10,
      text: ''
    },
    {
      name: 'Electro Ball',
      cost: [ CardType.LIGHTNING, CardType.COLORLESS ],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '54';

  public name: string = 'Mareep';

  public fullName: string = 'Mareep EVS';

}