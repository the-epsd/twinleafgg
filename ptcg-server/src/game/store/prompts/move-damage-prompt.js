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
exports.MoveDamagePrompt = exports.MoveDamagePromptType = void 0;
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
var prompt_1 = require("./prompt");
var play_card_action_1 = require("../actions/play-card-action");
var state_utils_1 = require("../state-utils");
exports.MoveDamagePromptType = 'Move damage';
var MoveDamagePrompt = /** @class */ (function (_super) {
    __extends(MoveDamagePrompt, _super);
    function MoveDamagePrompt(playerId, message, playerType, slots, maxAllowedDamage, options) {
        var _this = _super.call(this, playerId) || this;
        _this.message = message;
        _this.playerType = playerType;
        _this.slots = slots;
        _this.maxAllowedDamage = maxAllowedDamage;
        _this.type = exports.MoveDamagePromptType;
        // Default options
        _this.options = Object.assign({}, {
            allowCancel: true,
            min: 0,
            max: undefined,
            blockedFrom: [],
            blockedTo: [],
            singleSourceTarget: false,
            singleDestinationTarget: false
        }, options);
        return _this;
    }
    MoveDamagePrompt.prototype.decode = function (result, state) {
        var _this = this;
        if (result === null) {
            return result; // operation cancelled
        }
        var player = state.players.find(function (p) { return p.id === _this.playerId; });
        if (player === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
        }
        return result;
    };
    MoveDamagePrompt.prototype.validate = function (result, state) {
        var _this = this;
        if (result === null) {
            return this.options.allowCancel; // operation cancelled
        }
        if (this.options.singleSourceTarget) {
            var sources = new Set(result.map(function (r) { return JSON.stringify(r.from); }));
            if (sources.size > 1) {
                return false;
            }
        }
        if (this.options.singleDestinationTarget) {
            var destinations = new Set(result.map(function (r) { return JSON.stringify(r.to); }));
            if (destinations.size > 1) {
                return false;
            }
        }
        if (result.length < this.options.min) {
            return false;
        }
        if (this.options.max !== undefined && result.length > this.options.max) {
            return false;
        }
        var player = state.players.find(function (p) { return p.id === _this.playerId; });
        if (player === undefined) {
            return false;
        }
        var blockedFrom = this.options.blockedFrom.map(function (b) { return state_utils_1.StateUtils.getTarget(state, player, b); });
        var blockedTo = this.options.blockedTo.map(function (b) { return state_utils_1.StateUtils.getTarget(state, player, b); });
        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
            var r = result_1[_i];
            var from = state_utils_1.StateUtils.getTarget(state, player, r.from);
            if (from === undefined || blockedFrom.includes(from)) {
                return false;
            }
            var to = state_utils_1.StateUtils.getTarget(state, player, r.to);
            if (to === undefined || blockedTo.includes(to)) {
                return false;
            }
        }
        if (this.playerType !== play_card_action_1.PlayerType.ANY) {
            if (result.some(function (r) { return r.from.player !== _this.playerType; })
                || result.some(function (r) { return r.to.player !== _this.playerType; })) {
                return false;
            }
        }
        if (result.some(function (r) { return !_this.slots.includes(r.from.slot); })
            || result.some(function (r) { return !_this.slots.includes(r.to.slot); })) {
            return false;
        }
        return true;
    };
    return MoveDamagePrompt;
}(prompt_1.Prompt));
exports.MoveDamagePrompt = MoveDamagePrompt;
