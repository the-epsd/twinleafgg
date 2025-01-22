"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateUtils = void 0;
const game_error_1 = require("../game-error");
const game_message_1 = require("../game-message");
const play_card_action_1 = require("./actions/play-card-action");
const card_types_1 = require("./card/card-types");
class StateUtils {
    static getStadium(state) {
        throw new Error('Method not implemented.');
    }
    static checkEnoughEnergy(energyMap, cost) {
        // Step 1: Split the attack cost into hued energies (like Fire, Water) and colorless count
        // For example: cost of [F,W,C,C] becomes huesNeeded=[F,W] and colorlessNeeded=2
        const huesNeeded = [];
        let colorlessNeeded = 0;
        for (const c of cost) {
            if (c === card_types_1.CardType.COLORLESS) {
                colorlessNeeded++;
            }
            else if (c !== card_types_1.CardType.NONE && c !== card_types_1.CardType.ANY) {
                huesNeeded.push(c);
            }
        }
        // Step 2: Convert each Energy card's "provides" into its full set of possible types
        // For example: 
        // - A Basic Fire Energy's [F] stays as [F]
        // - Unit Energy LPM's [LPM] explodes to [L,P,M]
        // - Blend Energy WLFM's [WLFM] explodes to [W,L,F,M]
        const providedEnergySets = energyMap.map(e => {
            const providedEnergySet = [];
            e.provides.forEach((type) => {
                switch (type) {
                    case card_types_1.CardType.WLFM:
                        providedEnergySet.push(card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING, card_types_1.CardType.FIGHTING, card_types_1.CardType.METAL);
                        break;
                    case card_types_1.CardType.GRPD:
                        providedEnergySet.push(card_types_1.CardType.GRASS, card_types_1.CardType.FIRE, card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK);
                        break;
                    case card_types_1.CardType.LPM:
                        providedEnergySet.push(card_types_1.CardType.LIGHTNING, card_types_1.CardType.PSYCHIC, card_types_1.CardType.METAL);
                        break;
                    case card_types_1.CardType.GRW:
                        providedEnergySet.push(card_types_1.CardType.GRASS, card_types_1.CardType.FIRE, card_types_1.CardType.WATER);
                        break;
                    case card_types_1.CardType.FDY:
                        providedEnergySet.push(card_types_1.CardType.FIGHTING, card_types_1.CardType.DARK, card_types_1.CardType.FAIRY);
                        break;
                    case card_types_1.CardType.ANY:
                        providedEnergySet.push(card_types_1.CardType.ANY);
                        break;
                    default:
                        providedEnergySet.push(type);
                }
            });
            return providedEnergySet;
        });
        // Step 3: Use backtracking to find a valid assignment of Energy cards to hued costs
        // For example: If we need [L,P] and have Unit LPM + Blend WLFM:
        // - Try assigning Unit LPM to L, then see if Blend WLFM can provide P
        // - If that fails, try Unit LPM for P and Blend WLFM for L
        // - If any combination works, return true
        if (!StateUtils.canFulfillCosts(providedEnergySets, huesNeeded)) {
            return false;
        }
        // Step 4: If we found a valid way to cover all hued costs,
        // ensure we have enough total Energy cards left to cover colorless
        // Simple check: Do we have at least (hued costs + colorless costs) total Energy cards?
        if (energyMap.length < (huesNeeded.length + colorlessNeeded)) {
            return false;
        }
        return true;
    }
    /**
     * Uses backtracking and recursion to find a valid assignment of Energy cards to hued costs
     * @param provided Array of what each Energy card can provide (e.g. [[L,P,M], [W,L,F,M]])
     * @param needed Array of required hued Energy (e.g. [L,P])
     * @returns boolean indicating whether a valid assignment was found
     */
    static canFulfillCosts(provided, needed) {
        // Base case: if no more hued needs, we've found a valid assignment
        if (needed.length === 0) {
            return true;
        }
        const required = needed[0]; // Take the first needed type/hue
        // Try each available Energy card to fulfill this need
        for (let i = 0; i < provided.length; i++) {
            const set = provided[i];
            // If this Energy can provide the needed type/hue
            if (set.includes(required) || set.includes(card_types_1.CardType.ANY)) {
                // Remove this Energy from available pool (since it can only be used once)
                const newSets = provided.slice();
                newSets.splice(i, 1);
                // Recursively try to fulfill the remaining needs with remaining energies
                const newNeeded = needed.slice(1);
                if (StateUtils.canFulfillCosts(newSets, newNeeded)) {
                    return true; // Found a valid assignment!
                }
                // If that didn't work, the loop continues to try the next Energy card
            }
        }
        // If we tried all energies and found no valid assignment, return false
        return false;
    }
    static checkExactEnergy(energy, cost) {
        let enough = StateUtils.checkEnoughEnergy(energy, cost);
        if (!enough) {
            return false;
        }
        for (let i = 0; i < energy.length; i++) {
            const tempCards = energy.slice();
            tempCards.splice(i, 1);
            enough = StateUtils.checkEnoughEnergy(tempCards, cost);
            if (enough) {
                return false;
            }
        }
        return true;
    }
    static getPlayerById(state, playerId) {
        const player = state.players.find(p => p.id === playerId);
        if (player === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_GAME_STATE);
        }
        return player;
    }
    static getOpponent(state, player) {
        const opponent = state.players.find(p => p.id !== player.id);
        if (opponent === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_GAME_STATE);
        }
        return opponent;
    }
    static getTarget(state, player, target) {
        if (target.player === play_card_action_1.PlayerType.TOP_PLAYER) {
            player = StateUtils.getOpponent(state, player);
        }
        if (target.slot === play_card_action_1.SlotType.ACTIVE) {
            return player.active;
        }
        if (target.slot !== play_card_action_1.SlotType.BENCH) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        if (player.bench[target.index] === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        return player.bench[target.index];
    }
    static findCardList(state, card) {
        const cardLists = [];
        for (const player of state.players) {
            cardLists.push(player.active);
            cardLists.push(player.deck);
            cardLists.push(player.discard);
            cardLists.push(player.hand);
            cardLists.push(player.lostzone);
            cardLists.push(player.stadium);
            cardLists.push(player.supporter);
            player.bench.forEach(item => cardLists.push(item));
            player.prizes.forEach(item => cardLists.push(item));
        }
        const cardList = cardLists.find(c => c.cards.includes(card));
        if (cardList === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_GAME_STATE);
        }
        return cardList;
    }
    static findOwner(state, cardList) {
        for (const player of state.players) {
            const cardLists = [];
            cardLists.push(player.active);
            cardLists.push(player.deck);
            cardLists.push(player.discard);
            cardLists.push(player.hand);
            cardLists.push(player.lostzone);
            cardLists.push(player.stadium);
            cardLists.push(player.supporter);
            player.bench.forEach(item => cardLists.push(item));
            player.prizes.forEach(item => cardLists.push(item));
            if (cardLists.includes(cardList)) {
                return player;
            }
        }
        throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_GAME_STATE);
    }
    static getStadiumCard(state) {
        for (const player of state.players) {
            if (player.stadium.cards.length > 0) {
                return player.stadium.cards[0];
            }
        }
        return undefined;
    }
}
exports.StateUtils = StateUtils;
