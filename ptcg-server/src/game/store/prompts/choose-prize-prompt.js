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
exports.ChoosePrizePrompt = exports.ChoosePrizePromptType = void 0;
var prompt_1 = require("./prompt");
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
exports.ChoosePrizePromptType = 'Choose prize';
var ChoosePrizePrompt = /** @class */ (function (_super) {
    __extends(ChoosePrizePrompt, _super);
    function ChoosePrizePrompt(playerId, message, options) {
        var _this = _super.call(this, playerId) || this;
        _this.message = message;
        _this.type = exports.ChoosePrizePromptType;
        // Default options
        _this.options = Object.assign({}, {
            count: 1,
            max: 1,
            blocked: [],
            allowCancel: false,
            isSecret: false,
            useOpponentPrizes: false
        }, options);
        _this.options.max = _this.options.count;
        return _this;
    }
    ChoosePrizePrompt.prototype.decode = function (result, state) {
        var _this = this;
        if (result === null) {
            return result;
        }
        var player = state.players.find(function (p) { return p.id === _this.playerId; });
        if (player === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
        }
        var targetPlayer = this.options.useOpponentPrizes
            ? state.players.find(function (p) { return p.id !== _this.playerId; })
            : player;
        if (targetPlayer === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
        }
        var prizes = targetPlayer.prizes.filter(function (p) { return p.cards.length > 0; });
        return result.map(function (index) { return prizes[index]; });
    };
    ChoosePrizePrompt.prototype.validate = function (result) {
        if (result === null) {
            return this.options.allowCancel;
        }
        if (result.length !== this.options.count) {
            return false;
        }
        var hasDuplicates = result.some(function (p, index) {
            return result.indexOf(p) !== index;
        });
        if (hasDuplicates) {
            return false;
        }
        var hasEmpty = result.some(function (p) { return p.cards.length === 0; });
        if (hasEmpty) {
            return false;
        }
        return true;
    };
    return ChoosePrizePrompt;
}(prompt_1.Prompt));
exports.ChoosePrizePrompt = ChoosePrizePrompt;
