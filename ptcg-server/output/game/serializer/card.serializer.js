"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardSerializer = void 0;
const card_1 = require("../store/card/card");
const game_error_1 = require("../game-error");
const game_message_1 = require("../game-message");
class CardSerializer {
    constructor() {
        this.types = ['Card'];
        this.classes = [card_1.Card];
    }
    serialize(card) {
        const index = card.id;
        if (index === -1) {
            throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, `Card not found '${card.fullName}'.`);
        }
        return { _type: 'Card', index };
    }
    deserialize(data, context) {
        const index = data.index;
        const card = context.cards[index];
        if (card === undefined) {
            throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, `Card not found on index '${index}'.`);
        }
        return card;
    }
}
exports.CardSerializer = CardSerializer;
