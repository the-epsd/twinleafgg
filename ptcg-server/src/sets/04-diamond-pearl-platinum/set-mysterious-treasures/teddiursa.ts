import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealTargetEffect, RemoveSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Teddiursa extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Rest',
    cost: [C],
    damage: 0,
    text: 'Remove all Special Conditions and 2 damage counters from Teddiursa. Teddiursa is now Asleep.'
  },
  {
    name: 'Sweet Palm',
    cost: [C, C],
    damage: 30,
    text: 'Before doing damage, remove 1 damage counter from the Defending Pokémon.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';
  public name: string = 'Teddiursa';
  public fullName: string = 'Teddiursa MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rest
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const healTargetEffect = new HealTargetEffect(effect, 20);
      healTargetEffect.target = player.active;
      state = store.reduceEffect(state, healTargetEffect);
      const removeSpecialCondition = new RemoveSpecialConditionsEffect(effect, undefined);
      removeSpecialCondition.target = player.active;
      state = store.reduceEffect(state, removeSpecialCondition);
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, this);
    }

    // Sweet Palm
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const healTargetEffect = new HealTargetEffect(effect, 10);
      healTargetEffect.target = opponent.active;
      store.reduceEffect(state, healTargetEffect);
    }

    return state;
  }
}
