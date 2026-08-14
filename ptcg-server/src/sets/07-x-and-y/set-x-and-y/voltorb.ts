import { PokemonCard, Stage, CardType, Resistance, PowerType, StoreLike, State, StateUtils, GamePhase } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { KnockOutEffect } from '../../../game/store/effects/game-effects';

import { COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Voltorb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 50;
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
  public name: string = 'Voltorb';
  public fullName: string = 'Voltorb XY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] == opponent) {
        return state;
      }

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result === true) {

          opponent.active.damage += 50;
        }
      });
    }
    return state;
  }
}