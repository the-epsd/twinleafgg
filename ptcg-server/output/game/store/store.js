"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const abort_game_action_1 = require("./actions/abort-game-action");
const append_log_action_1 = require("./actions/append-log-action");
const card_1 = require("./card/card");
const change_avatar_action_1 = require("./actions/change-avatar-action");
const game_error_1 = require("../game-error");
const game_message_1 = require("../game-message");
const reorder_actions_1 = require("./actions/reorder-actions");
const resolve_prompt_action_1 = require("./actions/resolve-prompt-action");
const state_1 = require("./state/state");
const state_log_1 = require("./state/state-log");
const utils_1 = require("../../utils/utils");
const attack_effect_1 = require("./effect-reducers/attack-effect");
const play_card_reducer_1 = require("./reducers/play-card-reducer");
const play_energy_effect_1 = require("./effect-reducers/play-energy-effect");
const play_pokemon_effect_1 = require("./effect-reducers/play-pokemon-effect");
const play_trainer_effect_1 = require("./effect-reducers/play-trainer-effect");
const player_turn_reducer_1 = require("./reducers/player-turn-reducer");
const game_phase_effect_1 = require("./effect-reducers/game-phase-effect");
const game_effect_1 = require("./effect-reducers/game-effect");
const check_effect_1 = require("./effect-reducers/check-effect");
const player_state_reducer_1 = require("./reducers/player-state-reducer");
const retreat_effect_1 = require("./effect-reducers/retreat-effect");
const setup_reducer_1 = require("./reducers/setup-reducer");
const abort_game_reducer_1 = require("./reducers/abort-game-reducer");
class Store {
    constructor(handler) {
        this.handler = handler;
        this.state = new state_1.State();
        this.promptItems = [];
        this.waitItems = [];
        this.logId = 0;
    }
    dispatch(action) {
        let state = this.state;
        if (action instanceof abort_game_action_1.AbortGameAction) {
            state = abort_game_reducer_1.abortGameReducer(this, state, action);
            this.handler.onStateChange(state);
            return state;
        }
        if (action instanceof reorder_actions_1.ReorderHandAction
            || action instanceof reorder_actions_1.ReorderBenchAction
            || action instanceof change_avatar_action_1.ChangeAvatarAction) {
            state = player_state_reducer_1.playerStateReducer(this, state, action);
            this.handler.onStateChange(state);
            return state;
        }
        if (action instanceof resolve_prompt_action_1.ResolvePromptAction) {
            state = this.reducePrompt(state, action);
            if (this.promptItems.length === 0) {
                state = check_effect_1.checkState(this, state);
            }
            this.handler.onStateChange(state);
            return state;
        }
        if (action instanceof append_log_action_1.AppendLogAction) {
            this.log(state, action.message, action.params, action.id);
            this.handler.onStateChange(state);
            return state;
        }
        if (state.prompts.some(p => p.result === undefined)) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ACTION_IN_PROGRESS);
        }
        state = this.reduce(state, action);
        return state;
    }
    reduceEffect(state, effect) {
        state = this.propagateEffect(state, effect);
        if (effect.preventDefault === true) {
            return state;
        }
        state = game_phase_effect_1.gamePhaseReducer(this, state, effect);
        state = play_energy_effect_1.playEnergyReducer(this, state, effect);
        state = play_pokemon_effect_1.playPokemonReducer(this, state, effect);
        state = play_trainer_effect_1.playTrainerReducer(this, state, effect);
        state = retreat_effect_1.retreatReducer(this, state, effect);
        state = game_effect_1.gameReducer(this, state, effect);
        state = attack_effect_1.attackReducer(this, state, effect);
        state = check_effect_1.checkStateReducer(this, state, effect);
        return state;
    }
    prompt(state, prompts, then) {
        if (!(prompts instanceof Array)) {
            prompts = [prompts];
        }
        for (let i = 0; i < prompts.length; i++) {
            const id = utils_1.generateId(state.prompts);
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
        const log = new state_log_1.StateLog(message, params, client);
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
            throw new game_error_1.GameError(game_message_1.GameMessage.PROMPT_ALREADY_RESOLVED);
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
        const stateBackup = utils_1.deepClone(state, [card_1.Card]);
        this.promptItems.length = 0;
        try {
            state = setup_reducer_1.setupPhaseReducer(this, state, action);
            state = play_card_reducer_1.playCardReducer(this, state, action);
            state = player_turn_reducer_1.playerTurnReducer(this, state, action);
            this.resolveWaitItems();
            if (this.promptItems.length === 0) {
                state = check_effect_1.checkState(this, state);
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
exports.Store = Store;
