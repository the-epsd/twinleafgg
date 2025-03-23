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
exports.ShowCardsPrompt = void 0;
var prompt_1 = require("./prompt");
var ShowCardsPrompt = /** @class */ (function (_super) {
    __extends(ShowCardsPrompt, _super);
    function ShowCardsPrompt(playerId, message, cards, options) {
        var _this = _super.call(this, playerId) || this;
        _this.message = message;
        _this.cards = cards;
        _this.type = 'Show cards';
        // Default options
        _this.options = Object.assign({}, {
            allowCancel: false
        }, options);
        return _this;
    }
    return ShowCardsPrompt;
}(prompt_1.Prompt));
exports.ShowCardsPrompt = ShowCardsPrompt;
