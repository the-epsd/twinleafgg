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
exports.PutDamagePrompt = exports.PutDamagePromptType = void 0;
var prompt_1 = require("./prompt");
var play_card_action_1 = require("../actions/play-card-action");
var state_utils_1 = require("../state-utils");
exports.PutDamagePromptType = 'Put damage';
var PutDamagePrompt = /** @class */ (function (_super) {
    __extends(PutDamagePrompt, _super);
    function PutDamagePrompt(playerId, message, playerType, slots, damage, maxAllowedDamage, options) {
        var _this = _super.call(this, playerId) || this;
        _this.message = message;
        _this.playerType = playerType;
        _this.slots = slots;
        _this.damage = damage;
        _this.maxAllowedDamage = maxAllowedDamage;
        _this.type = exports.PutDamagePromptType;
        // Default options
        _this.options = Object.assign({}, {
            allowCancel: true,
            blocked: [],
            allowPlacePartialDamage: false,
            damageMultiple: 10
        }, options);
        return _this;
    }
    PutDamagePrompt.prototype.decode = function (result, state) {
        return result;
    };
    PutDamagePrompt.prototype.validate = function (result, state) {
        var _this = this;
        if (result === null) {
            return this.options.allowCancel; // operation cancelled
        }
        var damage = 0;
        result.forEach(function (r) { damage += r.damage; });
        if (this.damage !== damage && !this.options.allowPlacePartialDamage) {
            return false;
        }
        var player = state.players.find(function (p) { return p.id === _this.playerId; });
        if (player === undefined) {
            return false;
        }
        var blocked = this.options.blocked.map(function (b) { return state_utils_1.StateUtils.getTarget(state, player, b); });
        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
            var r = result_1[_i];
            var target = state_utils_1.StateUtils.getTarget(state, player, r.target);
            if (target === undefined || blocked.includes(target)) {
                return false;
            }
        }
        if (this.playerType !== play_card_action_1.PlayerType.ANY) {
            if (result.some(function (r) { return r.target.player !== _this.playerType; })) {
                return false;
            }
        }
        if (result.some(function (r) { return !_this.slots.includes(r.target.slot); })) {
            return false;
        }
        return true;
    };
    return PutDamagePrompt;
}(prompt_1.Prompt));
exports.PutDamagePrompt = PutDamagePrompt;
