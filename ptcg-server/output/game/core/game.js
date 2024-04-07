"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const arbiter_1 = require("./arbiter");
const match_recorder_1 = require("./match-recorder");
const state_1 = require("../store/state/state");
const store_1 = require("../store/store");
const abort_game_action_1 = require("../store/actions/abort-game-action");
const card_types_1 = require("../store/card/card-types");
class Game {
    constructor(core, id, gameSettings) {
        this.core = core;
        this.gameSettings = gameSettings;
        this.maxInvalidMoves = 100;
        this.clients = [];
        this.playerStats = [];
        this.arbiter = new arbiter_1.Arbiter();
        this.format = card_types_1.Format.STANDARD;
        this.id = id;
        this.store = new store_1.Store(this);
        this.store.state.rules = gameSettings.rules;
        this.matchRecorder = new match_recorder_1.MatchRecorder(core);
        this.format = gameSettings.format;
    }
    get state() {
        return this.store.state;
    }
    onStateChange(state) {
        if (this.handleArbiterPrompts(state)) {
            return;
        }
        if (this.gameSettings.recordingEnabled) {
            this.matchRecorder.onStateChange(state);
        }
        this.updateIsTimeRunning(state);
        this.core.emit(c => c.onStateChange(this, state));
        if (state.phase !== state_1.GamePhase.FINISHED && this.timeoutRef === undefined) {
            this.startTimer();
        }
        if (state.phase === state_1.GamePhase.FINISHED) {
            this.stopTimer();
            this.core.deleteGame(this);
        }
    }
    handleArbiterPrompts(state) {
        let resolved;
        const unresolved = state.prompts.filter(item => item.result === undefined);
        for (let i = 0; i < unresolved.length; i++) {
            const action = this.arbiter.resolvePrompt(state, unresolved[i]);
            if (action !== undefined) {
                resolved = { id: unresolved[i].id, action };
                break;
            }
        }
        if (resolved === undefined) {
            return false;
        }
        this.store.dispatch(resolved.action);
        return true;
    }
    dispatch(client, action) {
        let state = this.store.state;
        try {
            state = this.store.dispatch(action);
            state = this.updateInvalidMoves(state, client.id, false);
        }
        catch (error) {
            state = this.updateInvalidMoves(state, client.id, true);
            throw error;
        }
        return state;
    }
    handleClientLeave(client) {
        const state = this.store.state;
        if (state.phase === state_1.GamePhase.FINISHED) {
            return;
        }
        const player = state.players.find(p => p.id === client.id);
        if (player !== undefined) {
            const action = new abort_game_action_1.AbortGameAction(player.id, abort_game_action_1.AbortGameReason.DISCONNECTED);
            this.store.dispatch(action);
        }
    }
    updateInvalidMoves(state, playerId, isInvalidMove) {
        if (state.phase === state_1.GamePhase.FINISHED) {
            return state;
        }
        // Action dispatched not by the player
        const isPlayer = state.players.some(p => p.id === playerId);
        if (isPlayer === false) {
            return state;
        }
        const stats = this.playerStats.find(p => p.clientId === playerId);
        if (stats === undefined) {
            return state;
        }
        stats.invalidMoves = isInvalidMove ? stats.invalidMoves + 1 : 0;
        if (stats.invalidMoves > this.maxInvalidMoves) {
            const action = new abort_game_action_1.AbortGameAction(playerId, abort_game_action_1.AbortGameReason.ILLEGAL_MOVES);
            state = this.store.dispatch(action);
        }
        return state;
    }
    updateIsTimeRunning(state) {
        state.players.forEach(player => {
            const stats = this.playerStats.find(p => p.clientId === player.id);
            if (stats === undefined) {
                this.playerStats.push({
                    clientId: player.id,
                    isTimeRunning: false,
                    invalidMoves: 0,
                    timeLeft: this.gameSettings.timeLimit
                });
            }
        });
        const activePlayers = this.getTimeRunningPlayers(state);
        this.playerStats.forEach(p => {
            p.isTimeRunning = activePlayers.includes(p.clientId);
        });
    }
    /**
     * Returns playerIds that needs to make a move.
     * Used to calculate their time left.
     */
    getTimeRunningPlayers(state) {
        if (state.phase === state_1.GamePhase.WAITING_FOR_PLAYERS) {
            return [];
        }
        const result = [];
        state.prompts.filter(p => p.result === undefined).forEach(p => {
            if (!result.includes(p.playerId)) {
                result.push(p.playerId);
            }
        });
        if (result.length > 0) {
            return result;
        }
        const player = state.players[state.activePlayer];
        if (player !== undefined) {
            result.push(player.id);
        }
        return result;
    }
    startTimer() {
        const intervalDelay = 1000; // 1 second
        // Game time is set to unlimited
        if (this.gameSettings.timeLimit === 0) {
            return;
        }
        this.timeoutRef = setInterval(() => {
            for (const stats of this.playerStats) {
                if (stats.isTimeRunning) {
                    stats.timeLeft -= 1;
                    if (stats.timeLeft <= 0) {
                        const action = new abort_game_action_1.AbortGameAction(stats.clientId, abort_game_action_1.AbortGameReason.TIME_ELAPSED);
                        this.store.dispatch(action);
                        return;
                    }
                }
            }
        }, intervalDelay);
    }
    stopTimer() {
        if (this.timeoutRef !== undefined) {
            clearInterval(this.timeoutRef);
            this.timeoutRef = undefined;
        }
    }
}
exports.Game = Game;
