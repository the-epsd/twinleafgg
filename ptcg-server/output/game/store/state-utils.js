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
        // BEGIN HANDLING BLEND ENERGIES
        const blendProvides = [];
        // Check blend/unit energies
        provides.forEach((cardType, index) => {
            switch (cardType) {
                case card_types_1.CardType.LPM:
                    blendProvides.push([card_types_1.CardType.LIGHTNING, card_types_1.CardType.PSYCHIC, card_types_1.CardType.METAL]);
                    break;
                case card_types_1.CardType.GRW:
                    blendProvides.push([card_types_1.CardType.GRASS, card_types_1.CardType.FIRE, card_types_1.CardType.WATER]);
                    break;
                case card_types_1.CardType.FDY:
                    blendProvides.push([card_types_1.CardType.FAIRY, card_types_1.CardType.DARK, card_types_1.CardType.FIGHTING]);
                    break;
                case card_types_1.CardType.WLFM:
                    blendProvides.push([card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING, card_types_1.CardType.FIGHTING, card_types_1.CardType.METAL]);
                    break;
                case card_types_1.CardType.GRPD:
                    blendProvides.push([card_types_1.CardType.GRASS, card_types_1.CardType.FIRE, card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK]);
                    break;
                default:
                    return;
            }
        });
        const possibleBlendPermutations = this.getCombinations(blendProvides, blendProvides.length);
        const needsProvidingPermutations = [];
        if (needsProviding.length === 1) {
            needsProvidingPermutations.push(needsProviding);
        }
        else if (needsProviding.length > 1) {
            permutations(needsProviding, needsProviding.length);
        }
        // check needs providing from blendProvides
        // subtract 1 from rainbow when find is successful
        let needsProvidingMatchIndex = 0;
        let maxMatches = 0;
        possibleBlendPermutations.forEach((energyTypes, index) => {
            let matches = 0;
            for (let i = 0; i < needsProvidingPermutations.length; i++) {
                for (let j = 0; j < needsProvidingPermutations[i].length; j++) {
                    if (energyTypes[j] === needsProvidingPermutations[i][j]) {
                        matches++;
                    }
                }
                if (matches > maxMatches) {
                    maxMatches = matches;
                    needsProvidingMatchIndex = i;
                }
            }
        });
        // remove blend matches from rainbow requirement
        rainbow -= maxMatches;
        // remove matched energy from provides
        for (let i = 0; i < maxMatches; i++) {
            const index = provides.findIndex(energy => energy === needsProvidingPermutations[needsProvidingMatchIndex][i]);
            provides.splice(index, 1);
        }
        // END HANDLING BLEND ENERGIES
        // Check if we have enough rainbow energies
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
        // permutations calculation helper function
        function permutations(array, currentSize) {
            if (currentSize == 1) { // recursion base-case (end)
                needsProvidingPermutations.push(array.join('').split('').map(x => parseInt(x)));
            }
            for (let i = 0; i < currentSize; i++) {
                permutations(array, currentSize - 1);
                if (currentSize % 2 == 1) {
                    const temp = array[0];
                    array[0] = array[currentSize - 1];
                    array[currentSize - 1] = temp;
                }
                else {
                    const temp = array[i];
                    array[i] = array[currentSize - 1];
                    array[currentSize - 1] = temp;
                }
            }
        }
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
