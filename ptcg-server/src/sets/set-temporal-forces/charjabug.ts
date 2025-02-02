import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Charjabug extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Grubbin';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 100;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Static Shock',
      cost: [ CardType.LIGHTNING, CardType.LIGHTNING ],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'TEF';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '55';

  public name: string = 'Charjabug';

  public fullName: string = 'Charjabug TEF';

}