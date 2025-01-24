import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class VigorothSSP extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Slakoth';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    { name: 'Slashing Claw', cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 50, text: '' }
  ];

  public set: string = 'SVI';

  public setNumber = '146';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Vigoroth';

  public fullName: string = 'Vigoroth SSP';

}
