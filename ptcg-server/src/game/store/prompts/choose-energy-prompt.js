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
exports.ChooseEnergyPrompt = exports.ChooseEnergyPromptType = void 0;
var card_types_1 = require("../card/card-types");
var prompt_1 = require("./prompt");
var state_utils_1 = require("../state-utils");
exports.ChooseEnergyPromptType = 'Choose energy';
var ChooseEnergyPrompt = /** @class */ (function (_super) {
    __extends(ChooseEnergyPrompt, _super);
    function ChooseEnergyPrompt(playerId, message, energy, cost, options) {
        var _this = _super.call(this, playerId) || this;
        _this.message = message;
        _this.energy = energy;
        _this.cost = cost;
        _this.type = exports.ChooseEnergyPromptType;
        // Default options
        _this.options = Object.assign({}, {
            allowCancel: true
        }, options);
        if (_this.options.allowCancel === false) {
            _this.cost = _this.getCostThatCanBePaid();
        }
        return _this;
    }
    ChooseEnergyPrompt.prototype.decode = function (result) {
        if (result === null) {
            return null;
        }
        var energy = this.energy;
        return result.map(function (index) { return energy[index]; });
    };
    ChooseEnergyPrompt.prototype.validate = function (result) {
        if (result === null) {
            return this.options.allowCancel;
        }
        if (!state_utils_1.StateUtils.checkExactEnergy(result, this.cost)) {
            return false;
        }
        return true;
    };
    ChooseEnergyPrompt.prototype.getCostThatCanBePaid = function () {
        var result = this.cost.slice();
        var provides = this.energy.slice();
        var costs = this.cost.filter(function (c) { return c !== card_types_1.CardType.COLORLESS; });
        var colorlessCount = result.length - costs.length;
        var _loop_1 = function () {
            var cost = costs[0];
            var index = provides.findIndex(function (p) { return p.provides.includes(cost); });
            if (index === -1) {
                // concrete energy not found, try to use rainbow energies
                index = provides.findIndex(function (p) { return p.provides.includes(card_types_1.CardType.ANY); });
            }
            if (index !== -1) {
                // Energy can be paid, so remove that energy from the provides
                var provide = provides[index];
                provides.splice(index, 1);
                provide.provides.forEach(function (c) {
                    if (c === card_types_1.CardType.ANY && costs.length > 0) {
                        costs.shift();
                    }
                    else {
                        var i = costs.indexOf(c);
                        if (i !== -1) {
                            costs.splice(i, 1);
                        }
                    }
                });
            }
            else {
                // Impossible to pay for this cost
                costs.shift();
                var costToDelete = result.indexOf(cost);
                if (costToDelete !== -1) {
                    result.splice(costToDelete, 1);
                }
            }
        };
        while (costs.length > 0 && provides.length > 0) {
            _loop_1();
        }
        var energyLeft = 0;
        for (var _i = 0, provides_1 = provides; _i < provides_1.length; _i++) {
            var energy = provides_1[_i];
            energyLeft += energy.provides.length;
        }
        var colorlessToDelete = Math.max(0, colorlessCount - energyLeft);
        for (var i = 0; i < colorlessToDelete; i++) {
            var costToDelete = result.indexOf(card_types_1.CardType.COLORLESS);
            if (costToDelete !== -1) {
                result.splice(costToDelete, 1);
            }
        }
        return result;
    };
    return ChooseEnergyPrompt;
}(prompt_1.Prompt));
exports.ChooseEnergyPrompt = ChooseEnergyPrompt;
