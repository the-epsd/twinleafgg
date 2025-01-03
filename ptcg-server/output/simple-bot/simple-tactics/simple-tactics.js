"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTactic = void 0;
const game_1 = require("../../game");
const simulator_1 = require("../../game/bots/simulator");
const state_score_1 = require("../state-score/state-score");
class SimpleTactic {
    constructor(options) {
        this.options = options;
        this.stateScore = new state_score_1.StateScore(this.options);
    }
    getCardTarget(player, state, target) {
        if (target === player.active) {
            return { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 };
        }
        for (let index = 0; index < player.bench.length; index++) {
            if (target === player.bench[index]) {
                return { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.BENCH, index };
            }
        }
        const opponent = state.players.find(p => p !== player);
        if (opponent === undefined) {
            throw new game_1.GameError(game_1.GameMessage.INVALID_GAME_STATE);
        }
        if (target === opponent.active) {
            return { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 };
        }
        for (let index = 0; index < opponent.bench.length; index++) {
            if (target === opponent.bench[index]) {
                return { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.BENCH, index };
            }
        }
        throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
    }
    simulateAction(state, action) {
        let newState = state;
        try {
            const simulator = new simulator_1.Simulator(state, this.options.arbiter);
            newState = simulator.dispatch(action);
            while (simulator.store.state.prompts.some(p => p.result === undefined)) {
                newState = simulator.store.state;
                const prompt = newState.prompts.find(p => p.result === undefined);
                if (prompt === undefined) {
                    break;
                }
                const player = newState.players.find(p => p.id === prompt.playerId);
                if (player === undefined) {
                    break;
                }
                const resolveAction = this.resolvePrompt(newState, player, prompt);
                newState = simulator.dispatch(resolveAction);
            }
        }
        catch (error) {
            return undefined;
        }
        return newState;
    }
    resolvePrompt(state, player, prompt) {
        const resolvers = this.options.promptResolvers.map(resolver => new resolver(this.options));
        for (let i = 0; i < resolvers.length; i++) {
            const action = resolvers[i].resolvePrompt(state, player, prompt);
            if (action !== undefined) {
                return action;
            }
        }
        // Unknown prompt. Try to cancel it.
        return new game_1.ResolvePromptAction(prompt.id, null);
    }
    getStateScore(state, playerId) {
        return this.stateScore.getScore(state, playerId);
    }
    evaluateAction(state, playerId, action, passTurnScore = 0) {
        const newState = this.simulateAction(state, action);
        const newPlayer = newState && newState.players.find(p => p.id === playerId);
        if (newState !== undefined && newPlayer !== undefined) {
            return this.stateScore.getScore(newState, playerId)
                + (newState.turn > state.turn ? passTurnScore : 0);
        }
    }
}
exports.SimpleTactic = SimpleTactic;
