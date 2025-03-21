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
    static checkEnoughEnergy(energy, cost) {
        if (cost.length === 0) {
            return true;
        }
        // Group energies by card to handle multi-energy cards correctly
        const cardEnergies = new Map();
        energy.forEach(e => {
            cardEnergies.set(e.card, e.provides);
        });
        // Create a working copy of the cost
        const remainingCost = [...cost];
        // Count colorless energy required
        let colorlessCount = 0;
        for (let i = remainingCost.length - 1; i >= 0; i--) {
            if (remainingCost[i] === card_types_1.CardType.COLORLESS) {
                colorlessCount++;
                remainingCost.splice(i, 1);
            }
            else if (remainingCost[i] === card_types_1.CardType.ANY || remainingCost[i] === card_types_1.CardType.NONE) {
                remainingCost.splice(i, 1);
            }
        }
        // First match specific energy types with cards that provide only that type
        for (let i = remainingCost.length - 1; i >= 0; i--) {
            const costType = remainingCost[i];
            // Look for single-energy cards first
            let found = false;
            for (const [card, provides] of cardEnergies.entries()) {
                if (provides.length === 1 && provides[0] === costType) {
                    cardEnergies.delete(card);
                    found = true;
                    break;
                }
            }
            if (found) {
                remainingCost.splice(i, 1);
            }
        }
        // Now handle multi-energy cards
        // Sort the remaining costs by rarity
        remainingCost.sort();
        for (let i = 0; i < remainingCost.length; i++) {
            const costType = remainingCost[i];
            let satisfied = false;
            // Look for a multi-energy card that can provide this type
            for (const [card, provides] of cardEnergies.entries()) {
                if (provides.includes(costType)) {
                    cardEnergies.delete(card);
                    satisfied = true;
                    break;
                }
            }
            if (!satisfied) {
                // Check for rainbow energy (ANY)
                for (const [card, provides] of cardEnergies.entries()) {
                    if (provides.includes(card_types_1.CardType.ANY)) {
                        cardEnergies.delete(card);
                        satisfied = true;
                        break;
                    }
                }
                if (!satisfied) {
                    return false; // Not enough energy
                }
            }
        }
        // Count remaining available energy for colorless
        let availableForColorless = 0;
        for (const _ of cardEnergies) {
            // Each remaining card contributes only 1 energy for colorless
            availableForColorless++;
        }
        return availableForColorless >= colorlessCount;
    }
    static getCombinations(arr, n) {
        let i, j, k, l = arr.length, childperm, ret = [];
        let elem = [];
        if (n == 1) {
            for (i = 0; i < arr.length; i++) {
                for (j = 0; j < arr[i].length; j++) {
                    ret.push([arr[i][j]]);
                }
            }
            return ret;
        }
        else {
            for (i = 0; i < l; i++) {
                elem = arr.shift();
                for (j = 0; j < elem.length; j++) {
                    childperm = this.getCombinations(arr.slice(), n - 1);
                    for (k = 0; k < childperm.length; k++) {
                        ret.push([elem[j]].concat(childperm[k]));
                    }
                }
            }
            return ret;
        }
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
    static isPokemonInPlay(player, pokemon, location) {
        let inPlay = false;
        player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            if (card === pokemon) {
                if ((location === play_card_action_1.SlotType.BENCH && cardList === player.active) ||
                    (location === play_card_action_1.SlotType.ACTIVE && cardList !== player.active)) {
                    inPlay = false;
                }
                else {
                    inPlay = true;
                }
            }
        });
        return inPlay;
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
