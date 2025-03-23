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
exports.ChoosePokemonPrompt = exports.ChoosePokemonPromptType = void 0;
var prompt_1 = require("./prompt");
var play_card_action_1 = require("../actions/play-card-action");
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
var state_utils_1 = require("../state-utils");
exports.ChoosePokemonPromptType = 'Choose pokemon';
var ChoosePokemonPrompt = /** @class */ (function (_super) {
    __extends(ChoosePokemonPrompt, _super);
    function ChoosePokemonPrompt(playerId, message, playerType, slots, options) {
        var _this = _super.call(this, playerId) || this;
        _this.message = message;
        _this.playerType = playerType;
        _this.slots = slots;
        _this.type = exports.ChoosePokemonPromptType;
        // Default options
        _this.options = Object.assign({}, {
            min: 1,
            max: 1,
            allowCancel: true,
            blocked: []
        }, options);
        return _this;
    }
    ChoosePokemonPrompt.prototype.decode = function (result, state) {
        var _this = this;
        if (result === null) {
            return result; // operation cancelled
        }
        var player = state.players.find(function (p) { return p.id === _this.playerId; });
        var opponent = state.players.find(function (p) { return p.id !== _this.playerId; });
        if (player === undefined || opponent === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
        }
        return result.map(function (target) {
            var p = target.player === play_card_action_1.PlayerType.BOTTOM_PLAYER ? player : opponent;
            return target.slot === play_card_action_1.SlotType.ACTIVE ? p.active : p.bench[target.index];
        });
    };
    ChoosePokemonPrompt.prototype.validate = function (result, state) {
        var _this = this;
        if (result === null) {
            return this.options.allowCancel;
        }
        if (result.length < this.options.min || result.length > this.options.max) {
            return false;
        }
        if (result.some(function (cardList) { return cardList.cards.length === 0; })) {
            return false;
        }
        var player = state.players.find(function (p) { return p.id === _this.playerId; });
        if (player === undefined) {
            return false;
        }
        var blocked = this.options.blocked.map(function (b) { return state_utils_1.StateUtils.getTarget(state, player, b); });
        if (result.some(function (r) { return blocked.includes(r); })) {
            return false;
        }
        return true;
    };
    return ChoosePokemonPrompt;
}(prompt_1.Prompt));
exports.ChoosePokemonPrompt = ChoosePokemonPrompt;
