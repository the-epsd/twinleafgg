"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardListSerializer = void 0;
const card_list_1 = require("../store/state/card-list");
const game_error_1 = require("../game-error");
const game_message_1 = require("../game-message");
const pokemon_card_list_1 = require("../store/state/pokemon-card-list");
class CardListSerializer {
    constructor() {
        this.types = ['CardList', 'PokemonCardList'];
        this.classes = [card_list_1.CardList, pokemon_card_list_1.PokemonCardList];
    }
    serialize(cardList) {
        const data = Object.assign({}, cardList);
        let constructorName = 'CardList';
        if (cardList instanceof pokemon_card_list_1.PokemonCardList) {
            constructorName = 'PokemonCardList';
            if (cardList.tool !== undefined) {
                data.tool = cardList.tool.id;
            }
        }
        return Object.assign(Object.assign({}, data), { _type: constructorName, cards: cardList.cards.map(card => card.id) });
    }
    deserialize(data, context) {
        const instance = data._type === 'PokemonCardList'
            ? new pokemon_card_list_1.PokemonCardList()
            : new card_list_1.CardList();
        delete data._type;
        if (data.tool !== undefined) {
            data.tool = this.fromIndex(data.tool, context);
        }
        const indexes = data.cards;
        data.cards = indexes.map(index => this.fromIndex(index, context));
        return Object.assign(instance, data);
    }
    fromIndex(index, context) {
        const card = context.cards[index];
        if (card === undefined) {
            throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, `Card not found on index '${index}'.`);
        }
        return card;
    }
}
exports.CardListSerializer = CardListSerializer;
