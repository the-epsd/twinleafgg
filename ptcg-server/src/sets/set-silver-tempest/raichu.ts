import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { OPPONENT_HAS_USED_VSTAR_POWER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Raichu extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pikachu';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Ambushing Spark',
      cost: [CardType.COLORLESS],
      damage: 40,
      damageCalculation: '+',
      text: 'If your opponent has used their VSTAR Power during this game, this attack does 100 more damage.'
    },
    {
      name: 'Electric Ball',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 120,
      text: ''
    }
  ];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '50';

  public name: string = 'Raichu';

  public fullName: string = 'Raichu SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      /*
       * Legacy pre-prefab implementation:
       * - resolved opponent with StateUtils.getOpponent(...)
       * - checked opponent.usedVSTAR directly
       */
      // Converted to prefab version (OPPONENT_HAS_USED_VSTAR_POWER).
      if (OPPONENT_HAS_USED_VSTAR_POWER(state, effect.player)) {
        effect.damage += 100;
      }
      return state;
    }
    return state;
  }
}
