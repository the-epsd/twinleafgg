import { AbortGameAction } from './actions/abort-game-action';
import { AppendLogAction } from './actions/append-log-action';
import { ConcedeAction } from './actions/concede-action';
import { Card } from './card/card';
import { GameError } from '../game-error';
import { GameMessage } from '../game-message';
import { ReorderHandAction, ReorderBenchAction } from './actions/reorder-actions';
import { ResolvePromptAction } from './actions/resolve-prompt-action';
import { State, GamePhase } from './state/state';
import { StateLog } from './state/state-log';
import { generateId, deepClone } from '../../utils/utils';
import { attackReducer } from './effect-reducers/attack-effect';
import { playCardReducer } from './reducers/play-card-reducer';
import { playEnergyReducer } from './effect-reducers/play-energy-effect';
import { playPokemonReducer } from './effect-reducers/play-pokemon-effect';
import { playPokemonFromDeckReducer } from './effect-reducers/play-pokemon-from-deck-effect';
import { playTrainerReducer } from './effect-reducers/play-trainer-effect';
import { playerTurnReducer } from './reducers/player-turn-reducer';
import { gamePhaseReducer } from './effect-reducers/game-phase-effect';
import { gameReducer } from './effect-reducers/game-effect';
import { checkState, checkStateReducer } from './effect-reducers/check-effect';
import { playerStateReducer } from './reducers/player-state-reducer';
import { retreatReducer } from './effect-reducers/retreat-effect';
import { setupPhaseReducer } from './reducers/setup-reducer';
import { abortGameReducer } from './reducers/abort-game-reducer';
import { concedeReducer } from './reducers/concede-reducer';
import { sandboxReducer } from './reducers/sandbox-reducer';
import { SandboxModifyPlayerAction } from './actions/sandbox-modify-player-action';
import { SandboxModifyGameStateAction } from './actions/sandbox-modify-game-state-action';
import { SandboxModifyCardAction } from './actions/sandbox-modify-card-action';
import { SandboxModifyPokemonAction } from './actions/sandbox-modify-pokemon-action';
export class Store {
    constructor(handler) {
        this.handler = handler;
        //private effectHistory: Effect[] = [];
        this.state = new State();
        this.promptItems = [];
        this.waitItems = [];
        this.logId = 0;
        // Flag to prevent nested playability calculations
        this.calculatingPlayability = false;
    }
    dispatch(action, clientRoleId) {
        let state = this.state;
        // Handle sandbox actions
        if (action instanceof SandboxModifyPlayerAction
            || action instanceof SandboxModifyGameStateAction
            || action instanceof SandboxModifyCardAction
            || action instanceof SandboxModifyPokemonAction) {
            if (clientRoleId === undefined) {
                throw new GameError(GameMessage.ILLEGAL_ACTION);
            }
            state = sandboxReducer(this, state, action, clientRoleId);
            this.notifyAction(action, state);
            this.handler.onStateChange(state);
            return state;
        }
        if (action instanceof AbortGameAction) {
            state = abortGameReducer(this, state, action);
            this.notifyAction(action, state);
            this.handler.onStateChange(state);
            return state;
        }
        if (action instanceof ConcedeAction) {
            state = concedeReducer(this, state, action);
            this.notifyAction(action, state);
            this.handler.onStateChange(state);
            return state;
        }
        if (action instanceof ReorderHandAction
            || action instanceof ReorderBenchAction) {
            state = playerStateReducer(state, action);
            this.notifyAction(action, state);
            this.handler.onStateChange(state);
            return state;
        }
        if (action instanceof ResolvePromptAction) {
            state = this.reducePrompt(state, action);
            if (this.promptItems.length === 0) {
                state = checkState(this, state);
            }
            this.notifyAction(action, state);
            this.handler.onStateChange(state);
            return state;
        }
        if (action instanceof AppendLogAction) {
            this.log(state, action.message, action.params, action.id);
            this.notifyAction(action, state);
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
        if (effect.preventDefault === true) {
            return state;
        }
        state = gamePhaseReducer(this, state, effect);
        state = playEnergyReducer(this, state, effect);
        state = playPokemonReducer(this, state, effect);
        state = playPokemonFromDeckReducer(this, state, effect);
        state = playTrainerReducer(this, state, effect);
        state = retreatReducer(this, state, effect);
        state = gameReducer(this, state, effect);
        state = attackReducer(this, state, effect);
        state = checkStateReducer(this, state, effect);
        // Calculate playability after all effects are processed
        // The calculatingPlayability flag prevents nested calls during playability checks
        state = this.calculatePlayability(state);
        return state;
    }
    compareEffects(effect1, effect2) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (effect1.type !== effect2.type) {
            return false;
        }
        const effect1CardId = (_b = (_a = effect1) === null || _a === void 0 ? void 0 : _a.card) === null || _b === void 0 ? void 0 : _b.id;
        const effect2CardId = (_d = (_c = effect2) === null || _c === void 0 ? void 0 : _c.card) === null || _d === void 0 ? void 0 : _d.id;
        const effect1CardPlayerId = (_f = (_e = effect1) === null || _e === void 0 ? void 0 : _e.player) === null || _f === void 0 ? void 0 : _f.id;
        const effect2CardPlayerId = (_h = (_g = effect2) === null || _g === void 0 ? void 0 : _g.player) === null || _h === void 0 ? void 0 : _h.id;
        return effect1CardId === effect2CardId &&
            effect1CardPlayerId === effect2CardPlayerId;
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
            const onResolve = prompt.onResolve;
            if (typeof onResolve === 'function') {
                onResolve.call(prompt, action.result, state);
            }
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
    cleanup() {
        this.promptItems = [];
        this.waitItems = [];
        this.logId = 0;
        this.state = new State();
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
            // Calculate playability before state change
            state = this.calculatePlayability(state);
        }
        catch (storeError) {
            // Illegal action
            this.state = stateBackup;
            this.promptItems.length = 0;
            throw storeError;
        }
        this.notifyAction(action, state);
        this.handler.onStateChange(state);
        return state;
    }
    notifyAction(action, state) {
        if (this.handler.onAction !== undefined) {
            this.handler.onAction(action, state);
        }
    }
    calculatePlayability(state) {
        var _a;
        // Prevent nested calls - if we're already calculating playability, skip
        if (this.calculatingPlayability) {
            return state;
        }
        // Skip playability calculation during setup and other non-play phases
        // Only calculate starting from Turn 1 (skip Turn 0 which is setup)
        if (state.phase !== GamePhase.PLAYER_TURN || state.turn < 1) {
            // Clear playability for all players when not in player turn or during setup
            for (const player of state.players) {
                player.playableCardIds = [];
            }
            return state;
        }
        // Skip if players aren't set up yet
        if (!state.players || state.players.length === 0) {
            return state;
        }
        // Set flag to prevent nested calls
        this.calculatingPlayability = true;
        // Track prompts before playability check to clean up any created during checks
        const promptItemsBefore = this.promptItems.length;
        const waitItemsBefore = this.waitItems.length;
        try {
            const { CAN_PLAY_CARD } = require('./prefabs/prefabs');
            for (const player of state.players) {
                // Clear previous playability
                player.playableCardIds = [];
                // Only calculate for the active player
                if (((_a = state.players[state.activePlayer]) === null || _a === void 0 ? void 0 : _a.id) !== player.id) {
                    continue;
                }
                // Check each card in hand
                for (const card of player.hand.cards) {
                    try {
                        // Skip cards without valid IDs (shouldn't happen, but safety check)
                        if (card.id === undefined || card.id === -1) {
                            continue;
                        }
                        if (CAN_PLAY_CARD(this, state, player, card)) {
                            player.playableCardIds.push(card.id);
                        }
                    }
                    catch (error) {
                        // If check fails, card is not playable - silently continue
                    }
                }
            }
        }
        catch (error) {
            // If playability calculation fails entirely, just clear all and continue
            // This prevents setup from breaking
            for (const player of state.players) {
                player.playableCardIds = [];
            }
        }
        finally {
            // Clean up any prompts or wait items that were created during playability checks
            // These are fake prompts from testing card playability and should not interfere with real game prompts
            if (this.promptItems.length > promptItemsBefore) {
                this.promptItems.splice(promptItemsBefore, this.promptItems.length - promptItemsBefore);
            }
            if (this.waitItems.length > waitItemsBefore) {
                this.waitItems.splice(waitItemsBefore, this.waitItems.length - waitItemsBefore);
            }
            // Always clear the flag, even if an error occurred
            this.calculatingPlayability = false;
        }
        return state;
    }
    propagateEffect(state, effect) {
        const cards = [];
        for (const player of state.players) {
            player.stadium.cards.forEach(c => cards.push(c));
            player.supporter.cards.forEach(c => cards.push(c));
            player.active.cards.forEach(c => cards.push(c));
            player.active.tools.forEach(t => cards.push(t));
            for (const bench of player.bench) {
                bench.cards.forEach(c => cards.push(c));
                bench.tools.forEach(t => cards.push(t));
            }
            for (const prize of player.prizes) {
                prize.cards.forEach(c => cards.push(c));
            }
            player.hand.cards.forEach(c => cards.push(c));
            player.deck.cards.forEach(c => cards.push(c));
            player.discard.cards.forEach(c => cards.push(c));
        }
        cards.sort(c => c.superType);
        cards.forEach(c => { state = this.callReduceEffect(c, this, state, effect); });
        return state;
    }
    // Utility function to call reduceEffect with override support
    callReduceEffect(card, store, state, effect) {
        var _a, _b, _c, _d;
        // Only try override for TrainerCard (for now)
        if (card.trainerType !== undefined) {
            // Import here to avoid circular dependency at module level
            const { getOverriddenReduceEffect } = require('./card/card-effect-overrides');
            const format = (_d = (_c = (_b = (_a = store) === null || _a === void 0 ? void 0 : _a.handler) === null || _b === void 0 ? void 0 : _b.gameSettings) === null || _c === void 0 ? void 0 : _c.format) !== null && _d !== void 0 ? _d : 0;
            const override = getOverriddenReduceEffect(card, format);
            if (override) {
                return override(store, state, effect);
            }
        }
        return card.reduceEffect(store, state, effect);
    }
}
