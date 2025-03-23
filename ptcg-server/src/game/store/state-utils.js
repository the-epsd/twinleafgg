"use strict";
exports.__esModule = true;
exports.StateUtils = void 0;
var game_error_1 = require("../game-error");
var game_message_1 = require("../game-message");
var play_card_action_1 = require("./actions/play-card-action");
var card_types_1 = require("./card/card-types");
var StateUtils = /** @class */ (function () {
    function StateUtils() {
    }
    StateUtils.getStadium = function (state) {
        throw new Error('Method not implemented.');
    };
    StateUtils.checkEnoughEnergy = function (energy, cost) {
        if (cost.length === 0) {
            return true;
        }
        var provides = [];
        energy.forEach(function (e) {
            e.provides.forEach(function (cardType) { return provides.push(cardType); });
        });
        var colorless = 0;
        var rainbow = 0;
        var needsProviding = [];
        // First remove from array cards with specific energy types
        cost.forEach(function (costType) {
            switch (costType) {
                case card_types_1.CardType.ANY:
                case card_types_1.CardType.NONE:
                    break;
                case card_types_1.CardType.COLORLESS:
                    colorless += 1;
                    break;
                default: {
                    var index = provides.findIndex(function (energy) { return energy === costType; });
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
        var blendProvides = [];
        // Check blend/unit energies
        provides.forEach(function (cardType, index) {
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
        var possibleBlendPermutations = this.getCombinations(blendProvides, blendProvides.length);
        var needsProvidingPermutations = [];
        if (needsProviding.length === 1) {
            needsProvidingPermutations.push(needsProviding);
        }
        else if (needsProviding.length > 1) {
            permutations(needsProviding, needsProviding.length);
        }
        // check needs providing from blendProvides
        // subtract 1 from rainbow when find is successful
        var needsProvidingMatchIndex = 0;
        var maxMatches = 0;
        possibleBlendPermutations.forEach(function (energyTypes, index) {
            var matches = 0;
            for (var i = 0; i < needsProvidingPermutations.length; i++) {
                for (var j = 0; j < needsProvidingPermutations[i].length; j++) {
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
        var _loop_1 = function (i) {
            var index = provides.findIndex(function (energy) { return energy === needsProvidingPermutations[needsProvidingMatchIndex][i]; });
            provides.splice(index, 1);
        };
        // remove matched energy from provides
        for (var i = 0; i < maxMatches; i++) {
            _loop_1(i);
        }
        // END HANDLING BLEND ENERGIES
        // Check if we have enough rainbow energies
        for (var i = 0; i < rainbow; i++) {
            var index = provides.findIndex(function (energy) { return energy === card_types_1.CardType.ANY; });
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
                needsProvidingPermutations.push(array.join('').split('').map(function (x) { return parseInt(x); }));
            }
            for (var i = 0; i < currentSize; i++) {
                permutations(array, currentSize - 1);
                if (currentSize % 2 == 1) {
                    var temp = array[0];
                    array[0] = array[currentSize - 1];
                    array[currentSize - 1] = temp;
                }
                else {
                    var temp = array[i];
                    array[i] = array[currentSize - 1];
                    array[currentSize - 1] = temp;
                }
            }
        }
    };
    StateUtils.getCombinations = function (arr, n) {
        var i, j, k, l = arr.length, childperm, ret = [];
        var elem = [];
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
    };
    StateUtils.checkExactEnergy = function (energy, cost) {
        var enough = StateUtils.checkEnoughEnergy(energy, cost);
        if (!enough) {
            return false;
        }
        for (var i = 0; i < energy.length; i++) {
            var tempCards = energy.slice();
            tempCards.splice(i, 1);
            enough = StateUtils.checkEnoughEnergy(tempCards, cost);
            if (enough) {
                return false;
            }
        }
        return true;
    };
    StateUtils.getPlayerById = function (state, playerId) {
        var player = state.players.find(function (p) { return p.id === playerId; });
        if (player === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_GAME_STATE);
        }
        return player;
    };
    StateUtils.getOpponent = function (state, player) {
        var opponent = state.players.find(function (p) { return p.id !== player.id; });
        if (opponent === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_GAME_STATE);
        }
        return opponent;
    };
    StateUtils.getTarget = function (state, player, target) {
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
    };
    StateUtils.findCardList = function (state, card) {
        var cardLists = [];
        for (var _i = 0, _a = state.players; _i < _a.length; _i++) {
            var player = _a[_i];
            cardLists.push(player.active);
            cardLists.push(player.deck);
            cardLists.push(player.discard);
            cardLists.push(player.hand);
            cardLists.push(player.lostzone);
            cardLists.push(player.stadium);
            cardLists.push(player.supporter);
            player.bench.forEach(function (item) { return cardLists.push(item); });
            player.prizes.forEach(function (item) { return cardLists.push(item); });
        }
        var cardList = cardLists.find(function (c) { return c.cards.includes(card); });
        if (cardList === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_GAME_STATE);
        }
        return cardList;
    };
    StateUtils.findOwner = function (state, cardList) {
        var _loop_2 = function (player) {
            var cardLists = [];
            cardLists.push(player.active);
            cardLists.push(player.deck);
            cardLists.push(player.discard);
            cardLists.push(player.hand);
            cardLists.push(player.lostzone);
            cardLists.push(player.stadium);
            cardLists.push(player.supporter);
            player.bench.forEach(function (item) { return cardLists.push(item); });
            player.prizes.forEach(function (item) { return cardLists.push(item); });
            if (cardLists.includes(cardList)) {
                return { value: player };
            }
        };
        for (var _i = 0, _a = state.players; _i < _a.length; _i++) {
            var player = _a[_i];
            var state_1 = _loop_2(player);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_GAME_STATE);
    };
    StateUtils.isPokemonInPlay = function (player, pokemon, location) {
        var inPlay = false;
        player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, function (cardList, card) {
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
    };
    StateUtils.getStadiumCard = function (state) {
        for (var _i = 0, _a = state.players; _i < _a.length; _i++) {
            var player = _a[_i];
            if (player.stadium.cards.length > 0) {
                return player.stadium.cards[0];
            }
        }
        return undefined;
    };
    return StateUtils;
}());
exports.StateUtils = StateUtils;
