import { CardList } from '../store/state/card-list';
import { GameError } from '../game-error';
import { GameCoreError } from '../game-message';
import { PokemonCardList } from '../store/state/pokemon-card-list';
export class CardListSerializer {
    constructor() {
        this.types = ['CardList', 'PokemonCardList'];
        this.classes = [CardList, PokemonCardList];
    }
    serialize(cardList) {
        const data = Object.assign({}, cardList);
        let constructorName = 'CardList';
        if (cardList instanceof PokemonCardList) {
            constructorName = 'PokemonCardList';
            if (cardList.tool !== undefined) {
                data.tool = cardList.tool.id;
            }
        }
        return Object.assign(Object.assign({}, data), { _type: constructorName, cards: cardList.cards.map(card => card.id) });
    }
    deserialize(data, context) {
        const instance = data._type === 'PokemonCardList'
            ? new PokemonCardList()
            : new CardList();
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
            throw new GameError(GameCoreError.ERROR_SERIALIZER, `Card not found on index '${index}'.`);
        }
        return card;
    }
}
