"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamePhaseReducer = exports.initNextTurn = exports.betweenTurns = void 0;
const game_phase_effects_1 = require("../effects/game-phase-effects");
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const card_types_1 = require("../card/card-types");
const state_1 = require("../state/state");
const check_effect_1 = require("./check-effect");
const coin_flip_prompt_1 = require("../prompts/coin-flip-prompt");
function getActivePlayer(state) {
    return state.players[state.activePlayer];
}
function betweenTurns(store, state, onComplete) {
    if (state.phase === state_1.GamePhase.PLAYER_TURN || state.phase === state_1.GamePhase.ATTACK) {
        state.phase = state_1.GamePhase.BETWEEN_TURNS;
    }
    for (const player of state.players) {
        store.reduceEffect(state, new game_phase_effects_1.BetweenTurnsEffect(player));
    }
    if (store.hasPrompts()) {
        return store.waitPrompt(state, () => {
            check_effect_1.checkState(store, state, () => onComplete());
        });
    }
    return check_effect_1.checkState(store, state, () => onComplete());
}
exports.betweenTurns = betweenTurns;
function initNextTurn(store, state) {
    if ([state_1.GamePhase.SETUP, state_1.GamePhase.BETWEEN_TURNS].indexOf(state.phase) === -1) {
        return state;
    }
    let player = getActivePlayer(state);
    if (state.phase === state_1.GamePhase.SETUP) {
        state.phase = state_1.GamePhase.PLAYER_TURN;
    }
    if (state.phase === state_1.GamePhase.BETWEEN_TURNS) {
        if (player.usedTurnSkip) {
            // eslint-disable-next-line no-self-assign
            state.activePlayer = state.activePlayer;
        }
        else {
            state.activePlayer = state.activePlayer ? 0 : 1;
        }
        state.phase = state_1.GamePhase.PLAYER_TURN;
        player = getActivePlayer(state);
    }
    state.turn++;
    store.log(state, game_message_1.GameLog.LOG_TURN, { turn: state.turn });
    // Skip draw card on first turn
    //if (state.turn === 1 && !state.rules.firstTurnDrawCard) {
    //  return state;
    //}
    // Draw card at the beginning
    store.log(state, game_message_1.GameLog.LOG_PLAYER_DRAWS_CARD, { name: player.name });
    if (player.deck.cards.length === 0) {
        store.log(state, game_message_1.GameLog.LOG_PLAYER_NO_CARDS_IN_DECK, { name: player.name });
        const winner = state.activePlayer ? state_1.GameWinner.PLAYER_1 : state_1.GameWinner.PLAYER_2;
        state = check_effect_1.endGame(store, state, winner);
        return state;
    }
    player.deck.moveTo(player.hand, 1);
    return state;
}
exports.initNextTurn = initNextTurn;
function startNextTurn(store, state) {
    const player = state.players[state.activePlayer];
    store.log(state, game_message_1.GameLog.LOG_PLAYER_ENDS_TURN, { name: player.name });
    // Remove Paralyzed at the end of the turn
    player.active.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
    // Move supporter cards to discard
    player.supporter.moveTo(player.discard);
    return betweenTurns(store, state, () => {
        if (state.phase !== state_1.GamePhase.FINISHED) {
            return initNextTurn(store, state);
        }
    });
}
function handleSpecialConditions(store, state, effect) {
    const player = effect.player;
    for (const sp of player.active.specialConditions) {
        switch (sp) {
            case card_types_1.SpecialCondition.POISONED:
                player.active.damage += effect.poisonDamage;
                break;
            case card_types_1.SpecialCondition.BURNED:
                if (effect.burnFlipResult === true) {
                    break;
                }
                if (effect.burnFlipResult === false) {
                    player.active.damage += effect.burnDamage;
                    break;
                }
                store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.FLIP_BURNED), result => {
                    if (result === false) {
                        player.active.damage += effect.burnDamage;
                    }
                });
                break;
            case card_types_1.SpecialCondition.ASLEEP:
                if (effect.asleepFlipResult === true) {
                    player.active.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                    break;
                }
                if (effect.asleepFlipResult === false) {
                    break;
                }
                store.log(state, game_message_1.GameLog.LOG_FLIP_ASLEEP, { name: player.name });
                store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.FLIP_ASLEEP), result => {
                    if (result === true) {
                        player.active.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                    }
                });
                break;
        }
    }
}
function gamePhaseReducer(store, state, effect) {
    if (effect instanceof game_phase_effects_1.EndTurnEffect) {
        const player = state.players[state.activePlayer];
        player.supporterTurn = 0;
        console.log('player.supporterTurn', player.supporterTurn);
        if (player === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.NOT_YOUR_TURN);
        }
        state = check_effect_1.checkState(store, state, () => {
            if (state.phase === state_1.GamePhase.FINISHED) {
                return;
            }
            return startNextTurn(store, state);
        });
        return state;
    }
    if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
        handleSpecialConditions(store, state, effect);
    }
    return state;
}
exports.gamePhaseReducer = gamePhaseReducer;
