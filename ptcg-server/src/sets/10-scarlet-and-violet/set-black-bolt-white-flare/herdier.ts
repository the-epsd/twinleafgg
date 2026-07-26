import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AFTER_ATTACK, SWITCH_OUT_OPPONENT_ACTIVE_POKEMON } from '../../../game/store/prefabs/prefabs';

export class Herdier extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Lillipup';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Roar',
    cost: [C],
    damage: 0,
    text: 'Switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
  },
  {
    name: 'Lunge Out',
    cost: [C, C, C],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public setNumber: string = '75';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Herdier';
  public fullName: string = 'Herdier SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Roar
    // Ref: set-destined-rivals/yanma.ts (Whirlwind)
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentHasBenched = opponent.bench.some(b => b.cards.length > 0);

      if (!opponentHasBenched) {
        return state;
      }

      return SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store, state, effect.player, {
        sourceEffect: effect,
      });
    }

    return state;
  }
}
