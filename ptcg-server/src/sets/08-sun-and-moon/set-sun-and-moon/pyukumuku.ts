import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { KnockOutEffect, PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { GamePhase, PowerType, StateUtils, StoreLike, State } from '../../../game';
import { FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS } from '../../../game/store/prefabs/attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Pyukumuku extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [W];
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Innards Out',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is your Active Pokémon and is Knocked Out by damage from an opponent\'s attack, put 6 damage counters on the Attacking Pokémon.'
  }];

  public attacks = [{
    name: 'Continuous Tumble',
    cost: [W],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip a coin until you get tails. This attack does 30 damage for each heads.'
  }];

  public set: string = 'SUM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Pyukumuku';
  public fullName: string = 'Pyukumuku SUM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Innards Out
    if (effect instanceof KnockOutEffect
      && effect.target.cards.includes(this)
      && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      if (effect.target !== player.active) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      store.reduceEffect(
        state,
        new PlaceDamageCountersEffect(player, opponent.active, 60, this, this.powers[0]),
      );
    }

    // Continuous Tumble
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS(store, state, effect, 30);
    }

    return state;
  }
}
