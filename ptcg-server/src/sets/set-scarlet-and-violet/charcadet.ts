import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Charcadet extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 70;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Heat Blast',
      cost: [ CardType.FIRE, CardType.FIRE, CardType.COLORLESS ],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '40';

  public name: string = 'Charcadet';

  public fullName: string = 'Charcadet SVI';

}