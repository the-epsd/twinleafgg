"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.AttachEnergyPrompt = exports.AttachEnergyPromptType = void 0;
var card_1 = require("../card/card");
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
var prompt_1 = require("./prompt");
var card_types_1 = require("../card/card-types");
exports.AttachEnergyPromptType = 'Attach energy';
var AttachEnergyPrompt = /** @class */ (function (_super) {
    __extends(AttachEnergyPrompt, _super);
    function AttachEnergyPrompt(playerId, message, cardList, playerType, slots, filter, options) {
        var _this = _super.call(this, playerId) || this;
        _this.message = message;
        _this.cardList = cardList;
        _this.playerType = playerType;
        _this.slots = slots;
        _this.filter = filter;
        _this.type = exports.AttachEnergyPromptType;
        // Default options
        _this.options = Object.assign({}, {
            allowCancel: true,
            min: 0,
            max: cardList.cards.length,
            blocked: [],
            blockedTo: [],
            differentTypes: false,
            sameTarget: false,
            differentTargets: false
        }, options);
        return _this;
    }
    AttachEnergyPrompt.prototype.decode = function (result, state) {
        var _this = this;
        if (result === null) {
            return result;
        }
        var player = state.players.find(function (p) { return p.id === _this.playerId; });
        if (player === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
        }
        var transfers = [];
        result.forEach(function (t) {
            var cardList = _this.cardList;
            var card = cardList.cards[t.index];
            // Verify this is a card.
            if (!(card instanceof card_1.Card)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
            }
            // Verify card is an energy card
            if (card.superType !== card_types_1.SuperType.ENERGY) {
                throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
            }
            // Verify card is not blocked
            if (_this.options.blocked.includes(t.index)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
            }
            transfers.push({ to: t.to, card: card });
        });
        return transfers;
    };
    AttachEnergyPrompt.prototype.validate = function (result) {
        var _this = this;
        if (result === null) {
            return this.options.allowCancel; // operation cancelled
        }
        if (result.length < this.options.min || result.length > this.options.max) {
            return false;
        }
        if (result.some(function (r) { return _this.options.blocked.includes(_this.cardList.cards.indexOf(r.card)); })) {
            return false;
        }
        if (this.options.maxPerType) {
            var typeCounts = new Map();
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var assign = result_1[_i];
                var energyCard = assign.card;
                var type = energyCard.provides[0];
                typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
                if (typeCounts.get(type) > this.options.maxPerType) {
                    return false;
                }
            }
        }
        // Check if all targets are the same
        if (this.options.sameTarget && result.length > 1) {
            var t_1 = result[0].to;
            var different = result.some(function (r) {
                return r.to.player !== t_1.player
                    || r.to.slot !== t_1.slot
                    || r.to.index !== t_1.index;
            });
            if (different) {
                return false;
            }
        }
        if (this.options.validCardTypes) {
            var onlyValidTypes = true;
            for (var _a = 0, result_2 = result; _a < result_2.length; _a++) {
                var assign = result_2[_a];
                var energyCard = assign.card;
                if (energyCard.provides.every(function (p) { return !_this.options.validCardTypes.includes(p); })) {
                    onlyValidTypes = false;
                }
            }
            return onlyValidTypes;
        }
        // Check if 'different types' restriction is valid
        if (this.options.differentTypes) {
            var typeMap = {};
            for (var _b = 0, result_3 = result; _b < result_3.length; _b++) {
                var assign = result_3[_b];
                var cardType = this.getCardType(assign.card);
                if (typeMap[cardType] === true) {
                    return false;
                }
                else {
                    typeMap[cardType] = true;
                }
            }
        }
        // Check if all selected targets are different
        if (this.options.differentTargets && result.length > 1) {
            var _loop_1 = function (i) {
                var t = result[i].to;
                var index = result.findIndex(function (r) {
                    return r.to.player === t.player
                        && r.to.slot === t.slot
                        && r.to.index === t.index;
                });
                if (index !== i) {
                    return { value: false };
                }
            };
            for (var i = 0; i < result.length; i++) {
                var state_1 = _loop_1(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
        return result.every(function (r) { return r.card !== undefined; });
    };
    AttachEnergyPrompt.prototype.getCardType = function (card) {
        if (card.superType === card_types_1.SuperType.ENERGY) {
            var energyCard = card;
            return energyCard.provides.length > 0 ? energyCard.provides[0] : card_types_1.CardType.NONE;
        }
        if (card.superType === card_types_1.SuperType.POKEMON) {
            var pokemonCard = card;
            return pokemonCard.cardType;
        }
        return card_types_1.CardType.NONE;
    };
    return AttachEnergyPrompt;
}(prompt_1.Prompt));
exports.AttachEnergyPrompt = AttachEnergyPrompt;
