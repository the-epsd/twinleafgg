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
exports.ShuffleDeckPrompt = void 0;
var prompt_1 = require("./prompt");
var ShuffleDeckPrompt = /** @class */ (function (_super) {
    __extends(ShuffleDeckPrompt, _super);
    function ShuffleDeckPrompt(playerId) {
        var _this = _super.call(this, playerId) || this;
        _this.type = 'Shuffle deck';
        return _this;
    }
    ShuffleDeckPrompt.prototype.validate = function (result, state) {
        var _this = this;
        if (result === null) {
            return false;
        }
        var player = state.players.find(function (p) { return p.id === _this.playerId; });
        if (player === undefined) {
            return false;
        }
        if (result.length !== player.deck.cards.length) {
            return false;
        }
        var s = result.slice();
        s.sort();
        for (var i = 0; i < s.length; i++) {
            if (s[i] !== i) {
                return false;
            }
        }
        return true;
    };
    return ShuffleDeckPrompt;
}(prompt_1.Prompt));
exports.ShuffleDeckPrompt = ShuffleDeckPrompt;
