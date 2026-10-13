import { GamePhase, PowerType, Resistance, StateUtils, StoreLike, State } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { KnockOutEffect, PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Voltorb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public resistance: Resistance[] = [];
  public retreat = [C];

  public powers = [{
    name: 'Destiny Burst',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is your Active Pokémon and is Knocked Out by damage from an opponent\'s attack, flip a coin. If heads, put 5 damage counters on the Attacking Pokémon.'
  }];

  public attacks = [{
    name: 'Rollout',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'XY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Voltorb';
  public fullName: string = 'Voltorb XY';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Destiny Burst
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] == opponent) {
        return state;
      }

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result === true) {
          store.reduceEffect(
            state,
            new PlaceDamageCountersEffect(player, opponent.active, 50, this, this.powers[0]),
          );
        }
      });
    }
    return state;
  }
}
