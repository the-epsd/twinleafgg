import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Snorunt extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public cardType: CardType = CardType.WATER;

  public hp: number = 60;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Headbutt',
      cost: [ CardType.WATER, CardType.COLORLESS ],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '35';

  public name: string = 'Snorunt';

  public fullName: string = 'Snorunt CRE';

}