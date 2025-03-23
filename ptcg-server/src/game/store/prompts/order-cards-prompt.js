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
exports.OrderCardsPrompt = exports.OrderCardsPromptType = void 0;
var prompt_1 = require("./prompt");
exports.OrderCardsPromptType = 'Order cards';
var OrderCardsPrompt = /** @class */ (function (_super) {
    __extends(OrderCardsPrompt, _super);
    function OrderCardsPrompt(playerId, message, cards, options) {
        var _this = _super.call(this, playerId) || this;
        _this.message = message;
        _this.cards = cards;
        _this.type = exports.OrderCardsPromptType;
        // Default options
        _this.options = Object.assign({}, {
            allowCancel: true
        }, options);
        return _this;
    }
    OrderCardsPrompt.prototype.validate = function (result) {
        if (result === null) {
            return this.options.allowCancel;
        }
        if (result.length !== this.cards.cards.length) {
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
    return OrderCardsPrompt;
}(prompt_1.Prompt));
exports.OrderCardsPrompt = OrderCardsPrompt;
