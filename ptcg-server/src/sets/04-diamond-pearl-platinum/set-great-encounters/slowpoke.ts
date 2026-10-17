import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealTargetEffect, RemoveSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Slowpoke extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rest',
    cost: [C],
    damage: 0,
    text: 'Remove all Special Conditions and 3 damage counters from Slowpoke. Slowpoke is now Asleep.'
  },
  {
    name: 'Tumble Over',
    cost: [W],
    damage: 20,
    text: 'Slowpoke can\'t attack during your next turn.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name: string = 'Slowpoke';
  public fullName: string = 'Slowpoke GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rest
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const healTargetEffect = new HealTargetEffect(effect, 30);
      healTargetEffect.target = player.active;
      state = store.reduceEffect(state, healTargetEffect);
      const removeSpecialCondition = new RemoveSpecialConditionsEffect(effect, undefined);
      removeSpecialCondition.target = player.active;
      state = store.reduceEffect(state, removeSpecialCondition);
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, this);
    }

    // Tumble Over
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
