import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { HealTargetEffect, RemoveSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';

export class Bibarel extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bidoof';
  public hp: number = 100;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: 20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rest',
    cost: [C],
    damage: 0,
    text: 'Remove all Special Conditions and 4 damage counters from Bibarel. Bibarel is now Asleep.'
  },
  {
    name: 'Take Down',
    cost: [C, C, C],
    damage: 60,
    text: 'Bibarel does 10 damage to itself.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Bibarel';
  public fullName: string = 'Bibarel DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rest
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const healTargetEffect = new HealTargetEffect(effect, 40);
      healTargetEffect.target = player.active;
      state = store.reduceEffect(state, healTargetEffect);
      const removeSpecialCondition = new RemoveSpecialConditionsEffect(effect, undefined);
      removeSpecialCondition.target = player.active;
      state = store.reduceEffect(state, removeSpecialCondition);
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, this);
    }

    // Take Down
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }

    return state;
  }
}
