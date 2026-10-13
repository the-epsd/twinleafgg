import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../../game/store/effects/game-phase-effects';
import { PowerType, StateUtils, StoreLike, State } from '../../../game';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Komala extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Drowsing',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon remains Asleep between turns, put 6 damage counters on your opponent\'s Active Pokémon.'
  }];

  public attacks = [{
    name: 'Snooze',
    cost: [C],
    damage: 0,
    text: 'This Pokémon is now Asleep.'
  }];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '185';
  public name: string = 'Komala';
  public fullName: string = 'Komala UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Drowsing
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);

      if (cardList !== player.active) {
        return state;
      }

      if (!player.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (player.active.getPokemonCard() !== this) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, player);
      store.reduceEffect(
        state,
        new PlaceDamageCountersEffect(player, opponent.active, 60, this, this.powers[0]),
      );
    }

    // Snooze
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.player, this);
    }

    return state;
  }
}
