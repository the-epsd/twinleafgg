"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simulator = void 0;
const store_1 = require("../store/store");
const bot_arbiter_1 = require("./bot-arbiter");
const game_error_1 = require("../game-error");
const game_message_1 = require("../game-message");
const utils_1 = require("../../utils");
const card_1 = require("../store/card/card");
class Simulator {
    constructor(state, botArbiterOptions = {}) {
        if (state.prompts.some(p => p.result === undefined)) {
            throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SIMULATOR_NOT_STABLE);
        }
        this.botArbiter = new bot_arbiter_1.BotArbiter(botArbiterOptions);
        this.store = new store_1.Store(this);
        this.store.state = utils_1.deepClone(state, [card_1.Card]);
    }
    clone() {
        return new Simulator(this.store.state);
    }
    onStateChange(state) { }
    handleArbiterPrompts(state) {
        let resolved;
        const unresolved = state.prompts.filter(item => item.result === undefined);
        for (let i = 0; i < unresolved.length; i++) {
            const action = this.botArbiter.resolvePrompt(state, unresolved[i]);
            if (action !== undefined) {
                resolved = { id: unresolved[i].id, action };
                break;
            }
        }
        return resolved ? resolved.action : undefined;
    }
    dispatch(action) {
        let state = this.store.dispatch(action);
        let resolve = this.handleArbiterPrompts(this.store.state);
        while (resolve !== undefined) {
            state = this.store.dispatch(resolve);
            resolve = this.handleArbiterPrompts(this.store.state);
        }
        return state;
    }
}
exports.Simulator = Simulator;
