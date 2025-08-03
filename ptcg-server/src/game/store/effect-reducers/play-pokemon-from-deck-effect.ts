import { PlayPokemonFromDeckEffect } from '../effects/play-card-effects';
import { GameError } from '../../game-error';
import { GameMessage, GameLog } from '../../game-message';
import { Effect } from '../effects/effect';
import { SpecialCondition, Stage } from '../card/card-types';
import { State } from '../state/state';
import { StoreLike } from '../store-like';

/**
 * Helper function to emit animation events
 */
function emitAnimationEvent(store: StoreLike, eventName: string, data: any): void {
  const game = (store as any).handler;
  if (game && game.core && typeof game.core.emit === 'function') {
    game.core.emit((c: any) => {
      if (typeof c.socket !== 'undefined') {
        c.socket.emit(`game[${game.id}]:${eventName}`, data);
      }
    });
  }
}

export function playPokemonFromDeckReducer(store: StoreLike, state: State, effect: Effect): State {

  /* Play pokemon card from deck */
  if (effect instanceof PlayPokemonFromDeckEffect) {
    const stage = effect.pokemonCard.stage;
    const isBasic = stage === Stage.BASIC;

    // Only allow Basic Pokémon to be played from deck
    if (!isBasic) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }

    // Check if target is empty (for Basic Pokémon)
    if (effect.target.cards.length === 0) {
      store.log(state, GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, {
        name: effect.player.name,
        card: effect.pokemonCard.name
      });
      effect.player.deck.moveCardTo(effect.pokemonCard, effect.target);
      effect.target.pokemonPlayedTurn = state.turn;
      effect.target.removeSpecialCondition(SpecialCondition.ABILITY_USED);

      // Emit basic animation event
      emitAnimationEvent(store, 'playBasicAnimation', {
        playerId: effect.player.id,
        cardId: effect.pokemonCard.id,
        slot: effect.slot ? String(effect.slot) : undefined,
        index: effect.index
      });

      return state;
    }

    throw new GameError(GameMessage.INVALID_TARGET);
  }

  return state;
} 