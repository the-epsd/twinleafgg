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
exports.TrainerCard = void 0;
var game_effects_1 = require("../effects/game-effects");
var card_1 = require("./card");
var card_types_1 = require("./card-types");
var TrainerCard = /** @class */ (function (_super) {
    __extends(TrainerCard, _super);
    function TrainerCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.superType = card_types_1.SuperType.TRAINER;
        _this.trainerType = card_types_1.TrainerType.ITEM;
        _this.format = card_types_1.Format.NONE;
        _this.text = '';
        _this.attacks = [];
        _this.powers = [];
        _this.firstTurn = false;
        _this.stadiumDirection = 'up';
        return _this;
    }
    TrainerCard.prototype.reduceEffect = function (store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect) {
            for (var i = 0; i < this.attacks.length; i++) {
                var attackEffect = this.attacks[i].effect;
                // console.log(this.attacks[i].name);
                if (effect.attack === this.attacks[i] && attackEffect !== undefined && typeof attackEffect === 'function') {
                    // console.log(attackEffect);
                    // console.log('we made it to handling!');
                    attackEffect(store, state, effect);
                }
            }
        }
        else if (effect instanceof game_effects_1.PowerEffect) {
            for (var i = 0; i < this.powers.length; i++) {
                if (effect.power === this.powers[i] && effect.power.effect !== undefined) {
                    return effect.power.effect(store, state, effect);
                }
            }
        }
        return state;
    };
    return TrainerCard;
}(card_1.Card));
exports.TrainerCard = TrainerCard;
