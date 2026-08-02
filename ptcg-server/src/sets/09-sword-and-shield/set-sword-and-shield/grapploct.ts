import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, DEFENDING_POKEMON_ATTACKS_COST_MORE_UNTIL_LEAVES_ACTIVE, OPPONENT_CANNOT_RETREAT_UNTIL_LEAVES_ACTIVE } from '../../../game/store/prefabs/prefabs';

export class Grapploct extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Clobbopus';
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Octolock',
    cost: [F, F],
    damage: 0,
    text: 'Until this Grapploct leaves the Active Spot, the Defending Pokémon\'s attacks cost [C][C] more, and the Defending Pokémon can\'t retreat. This effect can\'t be applied more than once.'
  },
  {
    name: 'Tough Swing',
    cost: [F, F, C],
    damage: 130,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  }];

  public regulationMark: string = 'D';
  public set: string = 'SSH';
  public setNumber: string = '113';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Grapploct';
  public fullName: string = 'Grapploct SSH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Octolock
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.attackCostIncreaseWhileActive === 0
        && !opponent.active.cannotRetreatWhileActive) {
        state = DEFENDING_POKEMON_ATTACKS_COST_MORE_UNTIL_LEAVES_ACTIVE(store, state, effect, 2);
        state = OPPONENT_CANNOT_RETREAT_UNTIL_LEAVES_ACTIVE(store, state, effect);
      }
    }
    // Tough Swing
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
    }

    return state;
  }
}
