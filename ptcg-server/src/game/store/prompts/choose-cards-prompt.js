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
exports.ChooseCardsPrompt = exports.ChooseCardsPromptType = void 0;
var card_types_1 = require("../card/card-types");
var prompt_1 = require("./prompt");
exports.ChooseCardsPromptType = 'Choose cards';
var ChooseCardsPrompt = /** @class */ (function (_super) {
    __extends(ChooseCardsPrompt, _super);
    function ChooseCardsPrompt(player, message, cards, filter, options) {
        var _this = _super.call(this, player.id) || this;
        _this.message = message;
        _this.cards = cards;
        _this.filter = filter;
        _this.type = exports.ChooseCardsPromptType;
        _this.blockedCardNames = [];
        _this.player = player;
        // Default options
        _this.options = Object.assign({}, {
            min: 0,
            max: cards.cards.length,
            allowCancel: true,
            blocked: [],
            isSecret: false,
            differentTypes: false,
            allowDifferentSuperTypes: true,
            maxPokemons: undefined,
            maxBasicEnergies: undefined,
            maxEnergies: undefined,
            maxTrainers: undefined,
            maxTools: undefined,
            maxStadiums: undefined,
            maxSupporters: undefined,
            maxSpecialEnergies: undefined,
            maxItems: undefined
        }, options);
        if (_this.options.blocked.length > 0) {
            for (var i = 0; i < _this.cards.cards.length; i++) {
                if (_this.options.blocked.indexOf(i) !== -1) {
                    if (_this.blockedCardNames.indexOf(_this.cards.cards[i].name) === -1) {
                        _this.blockedCardNames.push(_this.cards.cards[i].name);
                    }
                }
            }
        }
        if (!_this.options.isSecret) {
            if (_this.cards === _this.player.deck || _this.cards === _this.player.discard) {
                _this.cards.sort();
            }
        }
        if (_this.options.blocked.length > 0) {
            _this.options.blocked = [];
            _this.cards.cards.forEach(function (card, index) {
                if (_this.blockedCardNames.indexOf(card.name) !== -1) {
                    _this.options.blocked.push(index);
                }
            });
        }
        return _this;
    }
    ChooseCardsPrompt.prototype.decode = function (result) {
        if (result === null) {
            return null;
        }
        var cards = this.cards.cards;
        return result.map(function (index) { return cards[index]; });
    };
    ChooseCardsPrompt.prototype.validate = function (result) {
        var _this = this;
        if (result === null) {
            return this.options.allowCancel;
        }
        if (result.length < this.options.min || result.length > this.options.max) {
            return false;
        }
        if (!this.options.allowDifferentSuperTypes) {
            var set = new Set(result.map(function (r) { return r.superType; }));
            if (set.size > 1) {
                return false;
            }
        }
        // Check if 'different types' restriction is valid
        if (this.options.differentTypes) {
            var typeMap = {};
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var card = result_1[_i];
                var cardType = ChooseCardsPrompt.getCardType(card);
                if (typeMap[cardType] === true) {
                    return false;
                }
                else {
                    typeMap[cardType] = true;
                }
            }
        }
        // Check if 'max' restrictions are valid
        var countMap = {};
        for (var _a = 0, result_2 = result; _a < result_2.length; _a++) {
            var card = result_2[_a];
            var count = countMap[card.superType.toString()] || 0;
            countMap[card.superType.toString()] = count + 1;
            if (card.superType === card_types_1.SuperType.TRAINER) {
                var trainerTypeCount = countMap[card.superType + "-" + card.trainerType] || 0;
                countMap[card.superType + "-" + card.trainerType] = trainerTypeCount + 1;
            }
            if (card.superType === card_types_1.SuperType.ENERGY) {
                var energyTypeCount = countMap[card.superType + "-" + card.energyType] || 0;
                countMap[card.superType + "-" + card.energyType] = energyTypeCount + 1;
            }
        }
        var _b = this.options, maxPokemons = _b.maxPokemons, maxBasicEnergies = _b.maxBasicEnergies, maxTrainers = _b.maxTrainers, maxItems = _b.maxItems, maxTools = _b.maxTools, maxStadiums = _b.maxStadiums, maxSupporters = _b.maxSupporters, maxSpecialEnergies = _b.maxSpecialEnergies, maxEnergies = _b.maxEnergies;
        if ((maxPokemons !== undefined && maxPokemons < countMap["" + card_types_1.SuperType.POKEMON])
            || (maxBasicEnergies !== undefined && maxBasicEnergies < countMap[card_types_1.SuperType.ENERGY + "-" + card_types_1.EnergyType.BASIC])
            || (maxEnergies !== undefined && maxEnergies < countMap["" + card_types_1.SuperType.ENERGY])
            || (maxTrainers !== undefined && maxTrainers < countMap[card_types_1.SuperType.TRAINER + "-" + card_types_1.SuperType.TRAINER])
            || (maxItems !== undefined && maxItems < countMap[card_types_1.SuperType.TRAINER + "-" + card_types_1.TrainerType.ITEM])
            || (maxStadiums !== undefined && maxStadiums < countMap[card_types_1.SuperType.TRAINER + "-" + card_types_1.TrainerType.STADIUM])
            || (maxSupporters !== undefined && maxSupporters < countMap[card_types_1.SuperType.TRAINER + "-" + card_types_1.TrainerType.SUPPORTER])
            || (maxSpecialEnergies !== undefined && maxSpecialEnergies < countMap[card_types_1.SuperType.ENERGY + "-" + card_types_1.EnergyType.SPECIAL])
            || (maxTools !== undefined && maxTools < countMap[card_types_1.SuperType.TRAINER + "-" + card_types_1.TrainerType.TOOL])) {
            return false;
        }
        var blocked = this.options.blocked;
        return result.every(function (r) {
            var index = _this.cards.cards.indexOf(r);
            return index !== -1 && !blocked.includes(index) && _this.matchesFilter(r);
        });
    };
    ChooseCardsPrompt.getCardType = function (card) {
        if (card.superType === card_types_1.SuperType.ENERGY) {
            var energyCard = card;
            return energyCard.provides.length > 0 ? energyCard.provides[0] : card_types_1.CardType.NONE;
        }
        if (card.superType === card_types_1.SuperType.POKEMON) {
            var pokemonCard = card;
            return pokemonCard.cardType;
        }
        return card_types_1.CardType.NONE;
    };
    ChooseCardsPrompt.prototype.matchesFilter = function (card) {
        for (var key in this.filter) {
            if (Object.prototype.hasOwnProperty.call(this.filter, key)) {
                if (this.filter[key] !== card[key]) {
                    return false;
                }
            }
        }
        return true;
    };
    return ChooseCardsPrompt;
}(prompt_1.Prompt));
exports.ChooseCardsPrompt = ChooseCardsPrompt;
