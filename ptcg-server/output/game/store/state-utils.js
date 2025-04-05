"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateUtils = void 0;
const game_error_1 = require("../game-error");
const game_message_1 = require("../game-message");
const play_card_action_1 = require("./actions/play-card-action");
const card_types_1 = require("./card/card-types");
const energy_card_1 = require("./card/energy-card");
class StateUtils {
    static getStadium(state) {
        throw new Error('Method not implemented.');
    }
    static checkEnoughEnergy(energy, cost) {
        if (cost.length === 0) {
            return true;
        }
        const provides = [];
        energy.forEach(e => {
            e.provides.forEach(cardType => provides.push(cardType));
        });
        let colorless = 0;
        let rainbow = 0;
        const needsProviding = [];
        // First remove from array cards with specific energy types
        cost.forEach(costType => {
            switch (costType) {
                case card_types_1.CardType.ANY:
                case card_types_1.CardType.NONE:
                    break;
                case card_types_1.CardType.COLORLESS:
                    colorless += 1;
                    break;
                default: {
                    const index = provides.findIndex(energy => energy === costType);
                    if (index !== -1) {
                        provides.splice(index, 1);
                    }
                    else {
                        needsProviding.push(costType);
                        rainbow += 1;
                    }
                }
            }
        });
        // BEGIN HANDLING BLEND/UNIT ENERGIES
        const blendProvides = [];
        const blendCards = [];
        // Collect blend/unit energies and their possible provides
        energy.forEach((energyMap, index) => {
            const card = energyMap.card;
            if (card instanceof energy_card_1.EnergyCard) {
                let blendTypes;
                switch (card.name) {
                    case 'Blend Energy WLFM':
                        blendTypes = [card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING, card_types_1.CardType.FIGHTING, card_types_1.CardType.METAL];
                        break;
                    case 'Blend Energy GRPD':
                        blendTypes = [card_types_1.CardType.GRASS, card_types_1.CardType.FIRE, card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK];
                        break;
                    case 'Unit Energy GRW':
                        blendTypes = [card_types_1.CardType.GRASS, card_types_1.CardType.FIRE, card_types_1.CardType.WATER];
                        break;
                    case 'Unit Energy LPM':
                        blendTypes = [card_types_1.CardType.LIGHTNING, card_types_1.CardType.PSYCHIC, card_types_1.CardType.METAL];
                        break;
                    case 'Unit Energy FDY':
                        blendTypes = [card_types_1.CardType.FIGHTING, card_types_1.CardType.DARK, card_types_1.CardType.FAIRY];
                        break;
                }
                if (blendTypes) {
                    blendProvides.push(blendTypes);
                    blendCards.push(energyMap);
                }
            }
        });
        // For each needed energy type, try to match it with a blend energy
        const matchedBlends = new Set();
        for (let i = 0; i < needsProviding.length; i++) {
            const neededType = needsProviding[i];
            for (let j = 0; j < blendProvides.length; j++) {
                if (!matchedBlends.has(j) && blendProvides[j].includes(neededType)) {
                    // Found a match - remove this blend energy from provides
                    const index = provides.findIndex(energy => energy === blendCards[j].provides[0]);
                    if (index !== -1) {
                        provides.splice(index, 1);
                    }
                    matchedBlends.add(j);
                    rainbow--;
                    needsProviding.splice(i, 1);
                    i--; // Adjust index since we removed an element
                    break;
                }
            }
        }
        // END HANDLING BLEND/UNIT ENERGIES
        // Check if we have enough rainbow energies for remaining needs
        for (let i = 0; i < rainbow; i++) {
            const index = provides.findIndex(energy => energy === card_types_1.CardType.ANY);
            if (index !== -1) {
                provides.splice(index, 1);
            }
            else {
                return false;
            }
        }
        // Rest cards can be used to pay for colorless energies
        return provides.length >= colorless;
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
