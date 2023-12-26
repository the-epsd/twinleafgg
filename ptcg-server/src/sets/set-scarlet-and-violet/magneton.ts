import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Magneton extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Magnemite';

  public regulationMark = 'G';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Lightning Ball',
      cost: [ CardType.LIGHTNING ],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '64';

  public name: string = 'Magneton';

  public fullName: string = 'Magneton SVI';

}