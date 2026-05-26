import { PlayPokemonFromDeckEffect } from '../effects/play-card-effects';
import { GameError } from '../../game-error';
import { GameMessage, GameLog } from '../../game-message';
/**
 * Helper function to emit animation events
 */
function emitAnimationEvent(store, eventName, data) {
    const game = store.handler;
    if (game && game.core && typeof game.core.emit === 'function') {
        game.core.emit((c) => {
            if (typeof c.socket !== 'undefined') {
                c.socket.emit(`game[${game.id}]:${eventName}`, data);
            }
        });
    }
}
export function playPokemonFromDeckReducer(store, state, effect) {
    /* Play pokemon card from deck */
    if (effect instanceof PlayPokemonFromDeckEffect) {
        // Check if target is empty (for Basic Pokémon)
        if (effect.target.cards.length === 0) {
            store.log(state, GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, {
                name: effect.player.name,
                card: effect.pokemonCard.name
            });
            effect.player.deck.moveCardTo(effect.pokemonCard, effect.target);
            effect.target.pokemonPlayedTurn = state.turn;
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
