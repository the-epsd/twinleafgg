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
exports.PokemonCard = void 0;
var card_marker_1 = require("../state/card-marker");
var card_1 = require("./card");
var card_types_1 = require("./card-types");
var PokemonCard = /** @class */ (function (_super) {
    __extends(PokemonCard, _super);
    function PokemonCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.superType = card_types_1.SuperType.POKEMON;
        _this.cardType = card_types_1.CardType.NONE;
        _this.cardTag = [];
        _this.pokemonType = card_types_1.PokemonType.NORMAL;
        _this.evolvesFrom = '';
        _this.stage = card_types_1.Stage.BASIC;
        _this.retreat = [];
        _this.hp = 0;
        _this.weakness = [];
        _this.resistance = [];
        _this.powers = [];
        _this.attacks = [];
        _this.format = card_types_1.Format.NONE;
        _this.marker = new card_marker_1.Marker();
        _this.movedToActiveThisTurn = false;
        _this.tools = [];
        _this.archetype = [];
        _this.attacksThisTurn = 0;
        _this.maxAttacksThisTurn = 1;
        _this.allowSubsequentAttackChoice = false;
        return _this;
    }
    return PokemonCard;
}(card_1.Card));
exports.PokemonCard = PokemonCard;
