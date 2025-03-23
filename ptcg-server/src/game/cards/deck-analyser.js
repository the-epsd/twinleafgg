"use strict";
exports.__esModule = true;
exports.DeckAnalyser = void 0;
var card_manager_1 = require("./card-manager");
var energy_card_1 = require("../store/card/energy-card");
var card_types_1 = require("../store/card/card-types");
var pokemon_card_1 = require("../store/card/pokemon-card");
var DeckAnalyser = /** @class */ (function () {
    function DeckAnalyser(cardNames) {
        var _this = this;
        if (cardNames === void 0) { cardNames = []; }
        this.cardNames = cardNames;
        var cardManager = card_manager_1.CardManager.getInstance();
        this.cards = [];
        cardNames.forEach(function (name) {
            var card = cardManager.getCardByName(name);
            if (card !== undefined) {
                _this.cards.push(card);
            }
        });
    }
    DeckAnalyser.prototype.isValid = function () {
        var countMap = {};
        var prismStarCards = new Set();
        var hasBasicPokemon = false;
        var hasAceSpec = false;
        var hasRadiant = false;
        if (this.cards.length !== 60) {
            return false;
        }
        // Check for invalid Professor/Boss combinations
        var cardSet = new Set(this.cards.map(function (c) { return c.name; }));
        if ((cardSet.has('Professor Sycamore') && cardSet.has('Professor Juniper')) ||
            (cardSet.has('Professor Juniper') && cardSet.has('Professor\'s Research')) ||
            (cardSet.has('Professor Sycamore') && cardSet.has('Professor\'s Research')) ||
            (cardSet.has('Lysandre') && cardSet.has('Boss\'s Orders'))) {
            return false;
        }
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            if (card instanceof pokemon_card_1.PokemonCard && card.stage === card_types_1.Stage.BASIC) {
                hasBasicPokemon = true;
            }
            if (!(card instanceof energy_card_1.EnergyCard) || card.energyType !== card_types_1.EnergyType.BASIC) {
                countMap[card.name] = (countMap[card.name] || 0) + 1;
                if (countMap[card.name] > 4) {
                    return false;
                }
            }
            if (card.tags.includes(card_types_1.CardTag.ACE_SPEC)) {
                if (hasAceSpec) {
                    return false;
                }
                hasAceSpec = true;
            }
            if (card.tags.includes(card_types_1.CardTag.RADIANT)) {
                if (hasRadiant) {
                    return false;
                }
                hasRadiant = true;
            }
            if (card.tags.includes(card_types_1.CardTag.PRISM_STAR)) {
                if (prismStarCards.has(card.name)) {
                    return false;
                }
                prismStarCards.add(card.name);
            }
        }
        return hasBasicPokemon;
    };
    DeckAnalyser.prototype.getDeckType = function () {
        var cardTypes = [];
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            var cardType = card_types_1.CardType.NONE;
            if (card instanceof pokemon_card_1.PokemonCard) {
                cardType = card.cardType;
                if (cardType !== card_types_1.CardType.NONE && cardTypes.indexOf(cardType) === -1) {
                    cardTypes.push(cardType);
                }
            }
        }
        return cardTypes;
    };
    return DeckAnalyser;
}());
exports.DeckAnalyser = DeckAnalyser;
