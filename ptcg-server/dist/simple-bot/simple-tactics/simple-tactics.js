import { PlayerType, SlotType, GameError, GameMessage, ResolvePromptAction } from '../../game';
import { Simulator } from '../../game/bots/simulator';
import { StateScore } from '../state-score/state-score';
export class SimpleTactic {
    constructor(options) {
        this.options = options;
        this.stateScore = new StateScore(this.options);
    }
    getCardTarget(player, state, target) {
        if (target === player.active) {
            return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
        }
        for (let index = 0; index < player.bench.length; index++) {
            if (target === player.bench[index]) {
                return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index };
            }
        }
        const opponent = state.players.find(p => p !== player);
        if (opponent === undefined) {
            throw new GameError(GameMessage.INVALID_GAME_STATE);
        }
        if (target === opponent.active) {
            return { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
        }
        for (let index = 0; index < opponent.bench.length; index++) {
            if (target === opponent.bench[index]) {
                return { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index };
            }
        }
        throw new GameError(GameMessage.INVALID_TARGET);
    }
    simulateAction(state, action) {
        let newState = state;
        try {
            const simulator = new Simulator(state, this.options.arbiter);
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
        return new ResolvePromptAction(prompt.id, null);
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
export function getCardTarget(player, state, target) {
    if (target === player.active) {
        return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    }
    for (let index = 0; index < player.bench.length; index++) {
        if (target === player.bench[index]) {
            return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index };
        }
    }
    const opponent = state.players.find(p => p !== player);
    if (opponent === undefined) {
        throw new GameError(GameMessage.INVALID_GAME_STATE);
    }
    if (target === opponent.active) {
        return { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    }
    for (let index = 0; index < opponent.bench.length; index++) {
        if (target === opponent.bench[index]) {
            return { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index };
        }
    }
    throw new GameError(GameMessage.INVALID_TARGET);
}
