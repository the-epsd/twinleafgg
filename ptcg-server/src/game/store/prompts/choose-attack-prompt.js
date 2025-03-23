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
exports.ChooseAttackPrompt = exports.ChooseAttackPromptType = void 0;
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
var prompt_1 = require("./prompt");
exports.ChooseAttackPromptType = 'Choose attack';
var ChooseAttackPrompt = /** @class */ (function (_super) {
    __extends(ChooseAttackPrompt, _super);
    function ChooseAttackPrompt(playerId, message, cards, options) {
        var _this = _super.call(this, playerId) || this;
        _this.message = message;
        _this.cards = cards;
        _this.type = exports.ChooseAttackPromptType;
        // Default options
        _this.options = Object.assign({}, {
            allowCancel: false,
            blockedMessage: game_message_1.GameMessage.NOT_ENOUGH_ENERGY,
            blocked: []
        }, options);
        return _this;
    }
    ChooseAttackPrompt.prototype.decode = function (result, state) {
        if (result === null) {
            return result; // operation cancelled
        }
        var index = result.index;
        if (index < 0 || index >= this.cards.length) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
        }
        var card = this.cards[index];
        var attack = card.attacks.find(function (a) { return a.name === result.attack; });
        if (attack === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
        }
        return attack;
    };
    ChooseAttackPrompt.prototype.validate = function (result) {
        var _this = this;
        if (result === null) {
            return this.options.allowCancel; // operation cancelled
        }
        var blocked = this.options.blocked.map(function (b) {
            var card = _this.cards[b.index];
            if (card && card.attacks) {
                return card.attacks.find(function (a) { return a.name === b.attack; });
            }
        });
        if (blocked.includes(result)) {
            return false;
        }
        return this.cards.some(function (c) { return c.attacks.includes(result); });
    };
    return ChooseAttackPrompt;
}(prompt_1.Prompt));
exports.ChooseAttackPrompt = ChooseAttackPrompt;
