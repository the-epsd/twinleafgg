"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Store = void 0;
var abort_game_action_1 = require("./actions/abort-game-action");
var append_log_action_1 = require("./actions/append-log-action");
var card_1 = require("./card/card");
var change_avatar_action_1 = require("./actions/change-avatar-action");
var game_error_1 = require("../game-error");
var game_message_1 = require("../game-message");
var reorder_actions_1 = require("./actions/reorder-actions");
var resolve_prompt_action_1 = require("./actions/resolve-prompt-action");
var state_1 = require("./state/state");
var state_log_1 = require("./state/state-log");
var utils_1 = require("../../utils/utils");
var attack_effect_1 = require("./effect-reducers/attack-effect");
var play_card_reducer_1 = require("./reducers/play-card-reducer");
var play_energy_effect_1 = require("./effect-reducers/play-energy-effect");
var play_pokemon_effect_1 = require("./effect-reducers/play-pokemon-effect");
var play_trainer_effect_1 = require("./effect-reducers/play-trainer-effect");
var player_turn_reducer_1 = require("./reducers/player-turn-reducer");
var game_phase_effect_1 = require("./effect-reducers/game-phase-effect");
var game_effect_1 = require("./effect-reducers/game-effect");
var check_effect_1 = require("./effect-reducers/check-effect");
var player_state_reducer_1 = require("./reducers/player-state-reducer");
var retreat_effect_1 = require("./effect-reducers/retreat-effect");
var setup_reducer_1 = require("./reducers/setup-reducer");
var abort_game_reducer_1 = require("./reducers/abort-game-reducer");
var Store = /** @class */ (function () {
    function Store(handler) {
        this.handler = handler;
        //private effectHistory: Effect[] = [];
        this.state = new state_1.State();
        this.promptItems = [];
        this.waitItems = [];
        this.logId = 0;
    }
    Store.prototype.dispatch = function (action) {
        var state = this.state;
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
        if (state.prompts.some(function (p) { return p.result === undefined; })) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ACTION_IN_PROGRESS);
        }
        state = this.reduce(state, action);
        return state;
    };
    Store.prototype.reduceEffect = function (state, effect) {
        // this.checkEffectHistory(state, effect);
        state = this.propagateEffect(state, effect);
        // const cardEffect = <any>effect;
        // if (cardEffect.card)
        //   console.log(`Running effect: ${effect.type} for card ${cardEffect.card?.fullName}`);
        // if (cardEffect.energyCard)
        //   console.log(`Running effect: ${effect.type} for card ${cardEffect.energyCard?.fullName}`);
        // if (cardEffect.trainerCard)
        //   console.log(`Running effect: ${effect.type} for card ${cardEffect.trainerCard?.fullName}`);
        // if (cardEffect.pokemonCard)
        //   console.log(`Running effect: ${effect.type} for card ${cardEffect.pokemonCard?.fullName}`);
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
    };
    // checkEffectHistory(state: State, effect: Effect) {
    //   if (this.effectHistory.length === 300) {
    //     this.effectHistory.shift();
    //   }
    //   this.effectHistory.push(effect);
    //   if (this.effectHistory.length === 300) {
    //     let isLoop = true;
    //     const firstEffect = this.effectHistory[0];
    //     this.effectHistory.forEach((effect, index) => {
    //       if (index % 5 !== 0) {
    //         return;
    //       }
    //       if (!this.compareEffects(effect, firstEffect)) {
    //         isLoop = false;
    //       }
    //     });
    //     if (isLoop) {
    //       console.error(`Loop detected: ${firstEffect.type}, card: ${(<any>firstEffect).card?.fullName}`);
    //       throw new Error('Loop detected');
    //     }
    //   }
    // }
    Store.prototype.compareEffects = function (effect1, effect2) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (effect1.type !== effect2.type) {
            return false;
        }
        var effect1CardId = (_b = (_a = effect1) === null || _a === void 0 ? void 0 : _a.card) === null || _b === void 0 ? void 0 : _b.id;
        var effect2CardId = (_d = (_c = effect2) === null || _c === void 0 ? void 0 : _c.card) === null || _d === void 0 ? void 0 : _d.id;
        var effect1CardPlayerId = (_f = (_e = effect1) === null || _e === void 0 ? void 0 : _e.player) === null || _f === void 0 ? void 0 : _f.id;
        var effect2CardPlayerId = (_h = (_g = effect2) === null || _g === void 0 ? void 0 : _g.player) === null || _h === void 0 ? void 0 : _h.id;
        return effect1CardId === effect2CardId &&
            effect1CardPlayerId === effect2CardPlayerId;
    };
    Store.prototype.prompt = function (state, prompts, then) {
        if (!(prompts instanceof Array)) {
            prompts = [prompts];
        }
        for (var i = 0; i < prompts.length; i++) {
            var id = utils_1.generateId(state.prompts);
            prompts[i].id = id;
            state.prompts.push(prompts[i]);
        }
        var promptItem = {
            ids: prompts.map(function (prompt) { return prompt.id; }),
            then: then
        };
        this.promptItems.push(promptItem);
        return state;
    };
    Store.prototype.waitPrompt = function (state, callback) {
        this.waitItems.push(callback);
        return state;
    };
    Store.prototype.log = function (state, message, params, client) {
        var timestamp = new Date().toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).toString();
        var log = new state_log_1.StateLog(message, params, client);
        log.params = __assign(__assign({}, params), { timestamp: timestamp });
        log.id = ++this.logId;
        state.logs.push(log);
    };
    Store.prototype.reducePrompt = function (state, action) {
        // Resolve prompts actions
        var prompt = state.prompts.find(function (item) { return item.id === action.id; });
        var promptItem = this.promptItems.find(function (item) { return item.ids.indexOf(action.id) !== -1; });
        if (prompt === undefined || promptItem === undefined) {
            return state;
        }
        if (prompt.result !== undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.PROMPT_ALREADY_RESOLVED);
        }
        try {
            prompt.result = action.result;
            var results = promptItem.ids.map(function (id) {
                var p = state.prompts.find(function (item) { return item.id === id; });
                return p === undefined ? undefined : p.result;
            });
            if (action.log !== undefined) {
                this.log(state, action.log.message, action.log.params, action.log.client);
            }
            if (results.every(function (result) { return result !== undefined; })) {
                var itemIndex = this.promptItems.indexOf(promptItem);
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
    };
    Store.prototype.resolveWaitItems = function () {
        while (this.promptItems.length === 0 && this.waitItems.length > 0) {
            var waitItem = this.waitItems.pop();
            if (waitItem !== undefined) {
                waitItem();
            }
        }
    };
    Store.prototype.hasPrompts = function () {
        return this.promptItems.length > 0;
    };
    Store.prototype.cleanup = function () {
        this.promptItems = [];
        this.waitItems = [];
        this.logId = 0;
        this.state = new state_1.State();
    };
    Store.prototype.reduce = function (state, action) {
        var stateBackup = utils_1.deepClone(state, [card_1.Card]);
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
    };
    Store.prototype.propagateEffect = function (state, effect) {
        var _this = this;
        var cards = [];
        for (var _i = 0, _a = state.players; _i < _a.length; _i++) {
            var player = _a[_i];
            player.stadium.cards.forEach(function (c) { return cards.push(c); });
            player.supporter.cards.forEach(function (c) { return cards.push(c); });
            player.active.cards.forEach(function (c) { return cards.push(c); });
            for (var _b = 0, _c = player.bench; _b < _c.length; _b++) {
                var bench = _c[_b];
                bench.cards.forEach(function (c) { return cards.push(c); });
            }
            for (var _d = 0, _e = player.prizes; _d < _e.length; _d++) {
                var prize = _e[_d];
                prize.cards.forEach(function (c) { return cards.push(c); });
            }
            player.hand.cards.forEach(function (c) { return cards.push(c); });
            player.deck.cards.forEach(function (c) { return cards.push(c); });
            player.discard.cards.forEach(function (c) { return cards.push(c); });
        }
        cards.sort(function (c) { return c.superType; });
        cards.forEach(function (c) { state = c.reduceEffect(_this, state, effect); });
        return state;
    };
    return Store;
}());
exports.Store = Store;
