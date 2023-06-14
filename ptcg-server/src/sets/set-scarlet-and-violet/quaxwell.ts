import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChooseCardsPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';

export class Quaxwell extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Quaxly';

  public cardType: CardType = CardType.WATER;

  public hp: number = 100;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Rain Splash',
      cost: [ CardType.WATER ],
      damage: 20,
      text: ''
    },
    {
      name: 'Spiral Kick',
      cost: [ CardType.WATER, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'SVI';

  public name: string = 'Quaxwell';

  public fullName: string = 'Quaxwell SVI 53';

}