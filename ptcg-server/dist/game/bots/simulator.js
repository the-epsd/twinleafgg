import { Store } from '../store/store';
import { BotArbiter } from './bot-arbiter';
import { GameError } from '../game-error';
import { GameCoreError } from '../game-message';
import { deepClone } from '../../utils';
import { Card } from '../store/card/card';
export class Simulator {
    constructor(state, botArbiterOptions = {}) {
        if (state.prompts.some(p => p.result === undefined)) {
            throw new GameError(GameCoreError.ERROR_SIMULATOR_NOT_STABLE);
        }
        this.botArbiter = new BotArbiter(botArbiterOptions);
        this.store = new Store(this);
        this.store.state = deepClone(state, [Card]);
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
