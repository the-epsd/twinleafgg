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
exports.EnergyCard = void 0;
var card_1 = require("./card");
var card_types_1 = require("./card-types");
var EnergyCard = /** @class */ (function (_super) {
    __extends(EnergyCard, _super);
    function EnergyCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.superType = card_types_1.SuperType.ENERGY;
        _this.energyType = card_types_1.EnergyType.BASIC;
        _this.format = card_types_1.Format.NONE;
        _this.provides = [];
        _this.text = '';
        _this.isBlocked = false;
        _this.blendedEnergies = [];
        return _this;
    }
    return EnergyCard;
}(card_1.Card));
exports.EnergyCard = EnergyCard;
