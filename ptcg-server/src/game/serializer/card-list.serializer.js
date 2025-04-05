"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.CardListSerializer = void 0;
var card_list_1 = require("../store/state/card-list");
var game_error_1 = require("../game-error");
var game_message_1 = require("../game-message");
var pokemon_card_list_1 = require("../store/state/pokemon-card-list");
var CardListSerializer = /** @class */ (function () {
    function CardListSerializer() {
        this.types = ['CardList', 'PokemonCardList'];
        this.classes = [card_list_1.CardList, pokemon_card_list_1.PokemonCardList];
    }
    CardListSerializer.prototype.serialize = function (cardList) {
        var data = __assign({}, cardList);
        var constructorName = 'CardList';
        if (cardList instanceof pokemon_card_list_1.PokemonCardList) {
            constructorName = 'PokemonCardList';
            if (cardList.tool !== undefined) {
                data.tool = cardList.tool.id;
            }
        }
        return __assign(__assign({}, data), { _type: constructorName, cards: cardList.cards.map(function (card) { return card.id; }) });
    };
    CardListSerializer.prototype.deserialize = function (data, context) {
        var _this = this;
        var instance = data._type === 'PokemonCardList'
            ? new pokemon_card_list_1.PokemonCardList()
            : new card_list_1.CardList();
        delete data._type;
        if (data.tool !== undefined) {
            data.tool = this.fromIndex(data.tool, context);
        }
        var indexes = data.cards;
        data.cards = indexes.map(function (index) { return _this.fromIndex(index, context); });
        return Object.assign(instance, data);
    };
    CardListSerializer.prototype.fromIndex = function (index, context) {
        var card = context.cards[index];
        if (card === undefined) {
            throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, "Card not found on index '" + index + "'.");
        }
        return card;
    };
    return CardListSerializer;
}());
exports.CardListSerializer = CardListSerializer;
