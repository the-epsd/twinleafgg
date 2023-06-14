"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTacticsAi = void 0;
const game_1 = require("../game");
const simulator_1 = require("../game/bots/simulator");
class SimpleTacticsAi {
    constructor(client, options, deck) {
        this.client = client;
        this.deck = deck;
        this.tactics = options.tactics.map(tactic => new tactic(options));
        this.resolvers = options.promptResolvers.map(resolver => new resolver(options));
    }
    decodeNextAction(state) {
        let player;
        for (let i = 0; i < state.players.length; i++) {
            if (state.players[i].id === this.client.id) {
                player = state.players[i];
            }
        }
        if (player === undefined) {
            return;
        }
        if (state.prompts.length > 0) {
            const playerId = player.id;
            const prompt = state.prompts.find(p => p.playerId === playerId && p.result === undefined);
            if (prompt !== undefined) {
                return this.resolvePrompt(player, state, prompt);
            }
        }
        // Wait for other players to resolve the prompts.
        if (state.prompts.filter(p => p.result === undefined).length > 0) {
            return;
        }
        const activePlayer = state.players[state.activePlayer];
        const isMyTurn = activePlayer.id === this.client.id;
        if (state.phase === game_1.GamePhase.PLAYER_TURN && isMyTurn) {
            return this.decodePlayerTurnAction(player, state);
        }
    }
    decodePlayerTurnAction(player, state) {
        for (let i = 0; i < this.tactics.length; i++) {
            const action = this.tactics[i].useTactic(state, player);
            if (action !== undefined && this.isValidAction(state, action)) {
                return action;
            }
        }
        return new game_1.PassTurnAction(this.client.id);
    }
    resolvePrompt(player, state, prompt) {
        if (prompt instanceof game_1.InvitePlayerPrompt) {
            const result = this.deck;
            let log;
            if (result === null) {
                log = new game_1.StateLog(game_1.GameLog.LOG_TEXT, {
                    text: 'Sorry, my deck is not ready.'
                }, player.id);
            }
            return new game_1.ResolvePromptAction(prompt.id, result, log);
        }
        for (let i = 0; i < this.resolvers.length; i++) {
            const action = this.resolvers[i].resolvePrompt(state, player, prompt);
            if (action !== undefined) {
                return action;
            }
        }
        // Unknown prompt type. Try to cancel it.
        return new game_1.ResolvePromptAction(prompt.id, null);
    }
    isValidAction(state, action) {
        try {
            const simulator = new simulator_1.Simulator(state);
            simulator.dispatch(action);
        }
        catch (error) {
            return false;
        }
        return true;
    }
}
exports.SimpleTacticsAi = SimpleTacticsAi;
