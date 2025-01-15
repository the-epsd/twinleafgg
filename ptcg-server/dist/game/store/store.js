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
        //private effectHistory: Effect[] = [];
        this.state = new State();
        this.promptItems = [];
        this.waitItems = [];
        this.logId = 0;
        this.stateChangeCounter = 0;
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
        state = gamePhaseReducer(this, state, effect);
        state = playEnergyReducer(this, state, effect);
        state = playPokemonReducer(this, state, effect);
        state = playTrainerReducer(this, state, effect);
        state = retreatReducer(this, state, effect);
        state = gameReducer(this, state, effect);
        state = attackReducer(this, state, effect);
        state = checkStateReducer(this, state, effect);
        this.stateChangeCounter++;
        console.log(`Turn ${state.turn} | Total state changes: ${this.stateChangeCounter}`);
        return state;
    }
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
        var _a, _b, _c, _d, _e;
        const cardEffect = effect;
        const cardName = ((_a = cardEffect.card) === null || _a === void 0 ? void 0 : _a.fullName) || ((_b = cardEffect.energyCard) === null || _b === void 0 ? void 0 : _b.fullName) ||
            ((_c = cardEffect.trainerCard) === null || _c === void 0 ? void 0 : _c.fullName) || ((_d = cardEffect.pokemonCard) === null || _d === void 0 ? void 0 : _d.fullName) || 'No card';
        const playerName = ((_e = cardEffect.player) === null || _e === void 0 ? void 0 : _e.name) || 'No player';
        const cards = [];
        const startUsage = process.cpuUsage();
        const startTime = performance.now();
        const stateSize = JSON.stringify(state).length;
        try {
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
        finally {
            const endTime = performance.now();
            const endUsage = process.cpuUsage(startUsage);
            const cpuPercent = ((endUsage.user + endUsage.system) / 1000) * 100;
            console.log(`${cardName} | ${effect.type} | CPU: ${cpuPercent.toFixed(4)}% | Execution time: ${(endTime - startTime).toFixed(2)}ms | Player: ${playerName}`);
            console.log(`Game state size: ${Math.round(stateSize / 1024)}KB | Turn: ${state.turn}`);
        }
    }
}
//   private propagateEffect(state: State, effect: Effect): State {
//   const cardEffect = <any>effect;
//   const cardName = cardEffect.card?.fullName || cardEffect.energyCard?.fullName ||
//     cardEffect.trainerCard?.fullName || cardEffect.pokemonCard?.fullName || 'No card';
//   const playerName = cardEffect.player?.name || 'No player';
//   const cards: Card[] = [];
//   const startUsage = process.cpuUsage();
//   try {
//     const relevantZones = this.getRelevantZones(state, effect);
//     if (relevantZones) {
//       for (const player of state.players) {
//         for (const zone of relevantZones) {
//           switch (zone) {
//             case 'stadium':
//               player.stadium.cards.forEach(c => cards.push(c));
//               break;
//             case 'supporter':
//               player.supporter.cards.forEach(c => cards.push(c));
//               break;
//             case 'active':
//               player.active.cards.forEach(c => cards.push(c));
//               break;
//             case 'bench':
//               if (effect.type === 'CHECK_POKEMON_POWERS_EFFECT' || effect.type === 'POWER_EFFECT') {
//                 // Optimize bench scanning for power effects
//                 player.bench.filter(b => b.cards.length > 0)
//                   .forEach(b => b.cards.forEach(c => cards.push(c)));
//               } else {
//                 player.bench.forEach(b => b.cards.forEach(c => cards.push(c)));
//               }
//               break;
//             case 'hand':
//               if (effect.type === 'DREW_TOPDECK_EFFECT') {
//                 // Only check most recent card for draw effects
//                 const lastCard = player.hand.cards[player.hand.cards.length - 1];
//                 if (lastCard) cards.push(lastCard);
//               } else {
//                 player.hand.cards.forEach(c => cards.push(c));
//               }
//               break;
//             case 'prizes':
//               if (effect.type === 'CHECK_PRIZE_CARDS_EFFECT') {
//                 player.prizes.filter(p => !p.isSecret)
//                   .forEach(p => p.cards.forEach(c => cards.push(c)));
//               } else {
//                 player.prizes.forEach(p => p.cards.forEach(c => cards.push(c)));
//               }
//               break;
//           }
//         }
//       }
//     } else {
//       // Use original comprehensive card collection for undefined effects
//       for (const player of state.players) {
//         player.stadium.cards.forEach(c => cards.push(c));
//         player.supporter.cards.forEach(c => cards.push(c));
//         player.active.cards.forEach(c => cards.push(c));
//         for (const bench of player.bench) {
//           bench.cards.forEach(c => cards.push(c));
//         }
//         for (const prize of player.prizes) {
//           prize.cards.forEach(c => cards.push(c));
//         }
//         player.hand.cards.forEach(c => cards.push(c));
//         player.deck.cards.forEach(c => cards.push(c));
//         player.discard.cards.forEach(c => cards.push(c));
//       }
//     }
//     // Optimize card sorting based on effect type
//     if (effect.type !== 'CHECK_HP_EFFECT' && effect.type !== 'CHECK_TABLE_STATE_EFFECT') {
//       cards.sort(c => c.superType);
//     }
//     cards.forEach(c => { state = c.reduceEffect(this, state, effect); });
//     return state;
//   } finally {
//     const endUsage = process.cpuUsage(startUsage);
//     const cpuPercent = ((endUsage.user + endUsage.system) / 1000) * 10;
//     console.log(`${cardName} | ${effect.type} | CPU: ${cpuPercent.toFixed(4)}% | Player: ${playerName}`);
//   }
// }
//   private getRelevantZones(state: State, effect: Effect): string[] {
//   switch (effect.type) {
//     // case 'PLAY_SUPPORTER_EFFECT':
//     // case 'SUPPORTER_EFFECT':
//     //   return ['supporter'];
//     case 'CHECK_POKEMON_POWERS_EFFECT':
//     case 'POWER_EFFECT':
//     case 'USE_POWER_EFFECT':
//       return ['active', 'bench', 'discard', 'hand'];
//     case 'CHECK_RETREAT_COST_EFFECT':
//     case 'RETREAT_EFFECT':
//       return ['active'];
//     // case 'ATTACK_EFFECT':
//     // case 'DEAL_DAMAGE_EFFECT':
//     // case 'PUT_DAMAGE_EFFECT':
//     //   return ['active', 'bench', 'stadium'];
//     case 'CHECK_ENOUGH_ENERGY_EFFECT':
//     case 'ENERGY_EFFECT':
//       return ['active', 'bench'];
//     // case 'TRAINER_EFFECT':
//     //   if (effect instanceof UseStadiumEffect) {
//     //     return ['stadium'];
//     //   }
//     //   return ['active', 'bench', 'stadium', 'supporter'];
//     case 'CHECK_TABLE_STATE_EFFECT':
//     case 'CHECK_HP_EFFECT':
//       return ['active', 'bench'];
//     case 'DREW_TOPDECK_EFFECT':
//       return ['hand'];
//     default:
//       return ['stadium', 'supporter', 'active', 'bench', 'hand', 'prizes', 'deck', 'discard', 'lostzone'];
//   }
// }
// }
