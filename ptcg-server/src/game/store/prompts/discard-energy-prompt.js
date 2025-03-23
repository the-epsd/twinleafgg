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
exports.DiscardEnergyPrompt = exports.DiscardEnergyPromptType = void 0;
var card_1 = require("../card/card");
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
var prompt_1 = require("./prompt");
var state_utils_1 = require("../state-utils");
var card_types_1 = require("../card/card-types");
exports.DiscardEnergyPromptType = 'Discard energy';
var DiscardEnergyPrompt = /** @class */ (function (_super) {
    __extends(DiscardEnergyPrompt, _super);
    function DiscardEnergyPrompt(playerId, message, playerType, slots, filter, options) {
        var _this = _super.call(this, playerId) || this;
        _this.message = message;
        _this.playerType = playerType;
        _this.slots = slots;
        _this.filter = filter;
        _this.type = exports.DiscardEnergyPromptType;
        // Default options
        _this.options = Object.assign({}, {
            allowCancel: true,
            min: 0,
            max: undefined,
            blockedFrom: [],
            blockedMap: []
        }, options);
        return _this;
    }
    DiscardEnergyPrompt.prototype.decode = function (result, state) {
        var _this = this;
        if (result === null) {
            return result; // operation cancelled
        }
        var player = state.players.find(function (p) { return p.id === _this.playerId; });
        if (player === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
        }
        var transfers = [];
        var processedCards = new Set();
        result.forEach(function (t) {
            var cardList = state_utils_1.StateUtils.getTarget(state, player, t.from);
            // Check if we've already processed this card from this source
            // Create a unique key using the card target components and index
            var key = t.from.player + "-" + t.from.slot + "-" + t.from.index + "-" + t.index;
            if (processedCards.has(key)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
            }
            processedCards.add(key);
            var card = cardList.cards[t.index];
            // Verify this is a card.
            if (!(card instanceof card_1.Card)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
            }
            // Verify card is an energy card
            if (card.superType !== card_types_1.SuperType.ENERGY) {
                throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
            }
            transfers.push({ from: t.from, card: card });
        });
        return transfers;
    };
    DiscardEnergyPrompt.prototype.validate = function (result) {
        if (result === null) {
            return this.options.allowCancel; // operation cancelled
        }
        if (result.length < this.options.min || (this.options.max !== undefined && result.length > this.options.max)) {
            return false;
        }
        return result.every(function (r) { return r.card !== undefined; });
    };
    return DiscardEnergyPrompt;
}(prompt_1.Prompt));
exports.DiscardEnergyPrompt = DiscardEnergyPrompt;
