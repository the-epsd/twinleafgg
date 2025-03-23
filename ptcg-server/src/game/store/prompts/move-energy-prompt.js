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
exports.MoveEnergyPrompt = exports.MoveEnergyPromptType = void 0;
var card_1 = require("../card/card");
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
var prompt_1 = require("./prompt");
var state_utils_1 = require("../state-utils");
exports.MoveEnergyPromptType = 'Move energy';
var MoveEnergyPrompt = /** @class */ (function (_super) {
    __extends(MoveEnergyPrompt, _super);
    function MoveEnergyPrompt(playerId, message, playerType, slots, filter, options) {
        var _this = _super.call(this, playerId) || this;
        _this.message = message;
        _this.playerType = playerType;
        _this.slots = slots;
        _this.filter = filter;
        _this.type = exports.MoveEnergyPromptType;
        // Default options
        _this.options = Object.assign({}, {
            allowCancel: true,
            min: 0,
            max: undefined,
            blockedFrom: [],
            blockedTo: [],
            blockedMap: []
        }, options);
        return _this;
    }
    MoveEnergyPrompt.prototype.decode = function (result, state) {
        var _this = this;
        if (result === null) {
            return result; // operation cancelled
        }
        var player = state.players.find(function (p) { return p.id === _this.playerId; });
        if (player === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
        }
        var transfers = [];
        result.forEach(function (t) {
            var cardList = state_utils_1.StateUtils.getTarget(state, player, t.from);
            var card = cardList.cards[t.index];
            // Verify this is a card.
            if (!(card instanceof card_1.Card)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
            }
            transfers.push({ from: t.from, to: t.to, card: card });
        });
        return transfers;
    };
    MoveEnergyPrompt.prototype.validate = function (result) {
        if (result === null) {
            return this.options.allowCancel; // operation cancelled
        }
        return result.every(function (r) { return r.card !== undefined; });
    };
    return MoveEnergyPrompt;
}(prompt_1.Prompt));
exports.MoveEnergyPrompt = MoveEnergyPrompt;
