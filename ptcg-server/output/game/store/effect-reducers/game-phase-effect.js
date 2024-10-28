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
const play_card_action_1 = require("../actions/play-card-action");
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
    try {
        const beginTurn = new game_phase_effects_1.BeginTurnEffect(player);
        store.reduceEffect(state, beginTurn);
    }
    catch (_a) {
        return state;
    }
    player.deck.moveTo(player.hand, 1);
    // Check the drawn card
    const drawnCard = player.hand.cards[player.hand.cards.length - 1];
    try {
        const drewTopdeck = new game_phase_effects_1.DrewTopdeckEffect(player, drawnCard);
        store.reduceEffect(state, drewTopdeck);
    }
    catch (_b) {
        return state;
    }
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
                player.active.damage += effect.burnDamage;
                if (effect.burnFlipResult === true) {
                    break;
                }
                if (effect.burnFlipResult === false) {
                    player.active.damage += effect.burnDamage;
                    break;
                }
                store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.FLIP_BURNED), result => {
                    if (result === true) {
                        player.active.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
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
                const flipsForSleep = [];
                for (let i = 0; i < effect.player.active.sleepFlips; i++) {
                    store.log(state, game_message_1.GameLog.LOG_FLIP_ASLEEP, { name: player.name });
                    flipsForSleep.push(new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.FLIP_ASLEEP));
                }
                if (flipsForSleep.length > 0) {
                    store.prompt(state, flipsForSleep, results => {
                        const wakesUp = Array.isArray(results) ? results.every(r => r) : results;
                        if (wakesUp) {
                            player.active.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                        }
                    });
                }
                else {
                    player.active.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                }
                break;
        }
    }
}
function gamePhaseReducer(store, state, effect) {
    if (effect instanceof game_phase_effects_1.EndTurnEffect) {
        const player = state.players[state.activePlayer];
        player.canEvolve = false;
        player.canAttackFirstTurn = false;
        player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, cardList => {
            cardList.attacksThisTurn = 0;
        });
        player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, cardList => {
            const pokemonCard = cardList.getPokemonCard();
            if (pokemonCard && player.active.cards.includes(pokemonCard)) {
                cardList.removeSpecialCondition(card_types_1.SpecialCondition.ABILITY_USED);
                cardList.removeBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
            }
        });
        effect.player.marker.removeMarker(effect.player.DAMAGE_DEALT_MARKER);
        player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            if (cardList === player.active) {
                return;
            }
            cardList.removeSpecialCondition(card_types_1.SpecialCondition.ABILITY_USED);
            cardList.removeBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
        });
        player.supporterTurn = 0;
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
