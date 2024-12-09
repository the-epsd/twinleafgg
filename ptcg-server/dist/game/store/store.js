import { AbortGameAction } from './actions/abort-game-action';
import { AppendLogAction } from './actions/append-log-action';
import { Card } from './card/card';
import { ChangeAvatarAction } from './actions/change-avatar-action';
import { GameError } from '../game-error';
import { GameMessage } from '../game-message';
import { ReorderHandAction, ReorderBenchAction } from './actions/reorder-actions';
import { ResolvePromptAction } from './actions/resolve-prompt-action';
import { State } from './state/state';
import { StateLog } from './state/state-log';
import { generateId, deepClone } from '../../utils/utils';
import { attackReducer } from './effect-reducers/attack-effect';
import { playCardReducer } from './reducers/play-card-reducer';
import { playEnergyReducer } from './effect-reducers/play-energy-effect';
import { playPokemonReducer } from './effect-reducers/play-pokemon-effect';
import { playTrainerReducer } from './effect-reducers/play-trainer-effect';
import { playerTurnReducer } from './reducers/player-turn-reducer';
import { gamePhaseReducer } from './effect-reducers/game-phase-effect';
import { gameReducer } from './effect-reducers/game-effect';
import { checkState, checkStateReducer } from './effect-reducers/check-effect';
import { playerStateReducer } from './reducers/player-state-reducer';
import { retreatReducer } from './effect-reducers/retreat-effect';
import { setupPhaseReducer } from './reducers/setup-reducer';
import { abortGameReducer } from './reducers/abort-game-reducer';
export class Store {
    constructor(handler) {
        this.handler = handler;
        this.effectHistory = [];
        this.state = new State();
        this.promptItems = [];
        this.waitItems = [];
        this.logId = 0;
    }
    dispatch(action) {
        let state = this.state;
        if (action instanceof AbortGameAction) {
            state = abortGameReducer(this, state, action);
            this.handler.onStateChange(state);
            return state;
        }
        if (action instanceof ReorderHandAction
            || action instanceof ReorderBenchAction
            || action instanceof ChangeAvatarAction) {
            state = playerStateReducer(this, state, action);
            this.handler.onStateChange(state);
            return state;
        }
        if (action instanceof ResolvePromptAction) {
            state = this.reducePrompt(state, action);
            if (this.promptItems.length === 0) {
                state = checkState(this, state);
            }
            this.handler.onStateChange(state);
            return state;
        }
        if (action instanceof AppendLogAction) {
            this.log(state, action.message, action.params, action.id);
            this.handler.onStateChange(state);
            return state;
        }
        if (state.prompts.some(p => p.result === undefined)) {
            throw new GameError(GameMessage.ACTION_IN_PROGRESS);
        }
        state = this.reduce(state, action);
        return state;
    }
    reduceEffect(state, effect) {
        state = this.propagateEffect(state, effect);
        console.log(effect.type);
        if (this.effectHistory.length === 100) {
            this.effectHistory.shift();
        }
        this.effectHistory.push(effect);
        if (this.effectHistory.length === 100) {
            const firstEffects = this.effectHistory.slice(0, 10);
            this.effectHistory.slice(10, 90).forEach((effect, index) => {
                if (effect === firstEffects[0] &&
                    this.effectHistory[index + 1] === firstEffects[1] &&
                    this.effectHistory[index + 2] === firstEffects[2] &&
                    this.effectHistory[index + 3] === firstEffects[3] &&
                    this.effectHistory[index + 4] === firstEffects[4] &&
                    this.effectHistory[index + 5] === firstEffects[5] &&
                    this.effectHistory[index + 6] === firstEffects[6] &&
                    this.effectHistory[index + 7] === firstEffects[7] &&
                    this.effectHistory[index + 8] === firstEffects[8] &&
                    this.effectHistory[index + 9] === firstEffects[9]) {
                    console.log('Loop detected in effect: ' + effect);
                    throw new Error('Loop detected');
                }
            });
        }
        if (effect.preventDefault === true) {
            return state;
        }
        state = gamePhaseReducer(this, state, effect);
        state = playEnergyReducer(this, state, effect);
        state = playPokemonReducer(this, state, effect);
        state = playTrainerReducer(this, state, effect);
        state = retreatReducer(this, state, effect);
        state = gameReducer(this, state, effect);
        state = attackReducer(this, state, effect);
        state = checkStateReducer(this, state, effect);
        return state;
    }
    prompt(state, prompts, then) {
        if (!(prompts instanceof Array)) {
            prompts = [prompts];
        }
        for (let i = 0; i < prompts.length; i++) {
            const id = generateId(state.prompts);
            prompts[i].id = id;
            state.prompts.push(prompts[i]);
        }
        const promptItem = {
            ids: prompts.map(prompt => prompt.id),
            then: then
        };
        this.promptItems.push(promptItem);
        return state;
    }
    waitPrompt(state, callback) {
        this.waitItems.push(callback);
        return state;
    }
    log(state, message, params, client) {
        const timestamp = new Date().toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).toString();
        const log = new StateLog(message, params, client);
        log.params = Object.assign(Object.assign({}, params), { timestamp });
        log.id = ++this.logId;
        state.logs.push(log);
    }
    reducePrompt(state, action) {
        // Resolve prompts actions
        const prompt = state.prompts.find(item => item.id === action.id);
        const promptItem = this.promptItems.find(item => item.ids.indexOf(action.id) !== -1);
        if (prompt === undefined || promptItem === undefined) {
            return state;
        }
        if (prompt.result !== undefined) {
            throw new GameError(GameMessage.PROMPT_ALREADY_RESOLVED);
        }
        try {
            prompt.result = action.result;
            const results = promptItem.ids.map(id => {
                const p = state.prompts.find(item => item.id === id);
                return p === undefined ? undefined : p.result;
            });
            if (action.log !== undefined) {
                this.log(state, action.log.message, action.log.params, action.log.client);
            }
            if (results.every(result => result !== undefined)) {
                const itemIndex = this.promptItems.indexOf(promptItem);
                promptItem.then(results.length === 1 ? results[0] : results);
                this.promptItems.splice(itemIndex, 1);
            }
            this.resolveWaitItems();
        }
        catch (storeError) {
            // Illegal action
            prompt.result = undefined;
            throw storeError;
        }
        return state;
    }
    resolveWaitItems() {
        while (this.promptItems.length === 0 && this.waitItems.length > 0) {
            const waitItem = this.waitItems.pop();
            if (waitItem !== undefined) {
                waitItem();
            }
        }
    }
    hasPrompts() {
        return this.promptItems.length > 0;
    }
    reduce(state, action) {
        const stateBackup = deepClone(state, [Card]);
        this.promptItems.length = 0;
        try {
            state = setupPhaseReducer(this, state, action);
            state = playCardReducer(this, state, action);
            state = playerTurnReducer(this, state, action);
            this.resolveWaitItems();
            if (this.promptItems.length === 0) {
                state = checkState(this, state);
            }
        }
        catch (storeError) {
            // Illegal action
            this.state = stateBackup;
            this.promptItems.length = 0;
            throw storeError;
        }
        this.handler.onStateChange(state);
        return state;
    }
    propagateEffect(state, effect) {
        const cards = [];
        for (const player of state.players) {
            player.stadium.cards.forEach(c => cards.push(c));
            player.supporter.cards.forEach(c => cards.push(c));
            player.active.cards.forEach(c => cards.push(c));
            for (const bench of player.bench) {
                bench.cards.forEach(c => cards.push(c));
            }
            for (const prize of player.prizes) {
                prize.cards.forEach(c => cards.push(c));
            }
            player.hand.cards.forEach(c => cards.push(c));
            player.deck.cards.forEach(c => cards.push(c));
            player.discard.cards.forEach(c => cards.push(c));
        }
        cards.sort(c => c.superType);
        cards.forEach(c => { state = c.reduceEffect(this, state, effect); });
        return state;
    }
}
