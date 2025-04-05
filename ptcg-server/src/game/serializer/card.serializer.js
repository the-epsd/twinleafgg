"use strict";
exports.__esModule = true;
exports.CardSerializer = void 0;
var card_1 = require("../store/card/card");
var game_error_1 = require("../game-error");
var game_message_1 = require("../game-message");
var CardSerializer = /** @class */ (function () {
    function CardSerializer() {
        this.types = ['Card'];
        this.classes = [card_1.Card];
    }
    CardSerializer.prototype.serialize = function (card) {
        var index = card.id;
        if (index === -1) {
            throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, "Card not found '" + card.fullName + "'.");
        }
        return { _type: 'Card', index: index };
    };
    CardSerializer.prototype.deserialize = function (data, context) {
        var index = data.index;
        var card = context.cards[index];
        if (card === undefined) {
            throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, "Card not found on index '" + index + "'.");
        }
        return card;
    };
    return CardSerializer;
}());
exports.CardSerializer = CardSerializer;
