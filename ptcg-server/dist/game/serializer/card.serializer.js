import { Card } from '../store/card/card';
import { GameError } from '../game-error';
import { GameCoreError } from '../game-message';
export class CardSerializer {
    constructor() {
        this.types = ['Card'];
        this.classes = [Card];
    }
    serialize(card) {
        const index = card.id;
        if (index === -1) {
            throw new GameError(GameCoreError.ERROR_SERIALIZER, `Card not found '${card.fullName}'.`);
        }
        return { _type: 'Card', index };
    }
    deserialize(data, context) {
        const index = data.index;
        const card = context.cards[index];
        if (card === undefined) {
            throw new GameError(GameCoreError.ERROR_SERIALIZER, `Card not found on index '${index}'.`);
        }
        return card;
    }
}
