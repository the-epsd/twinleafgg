import { Card } from '../store/card/card';
import { PokemonCard } from '../store/card/pokemon-card';
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
        const result = { _type: 'Card', index };
        // Persist runtime evolution flags for PokemonCard (evolvesFromBase, evolvesToStage)
        // so they survive serialization and reach the client for 3D board hover effects
        if (card instanceof PokemonCard) {
            const pokemonCard = card;
            if (pokemonCard.evolvesFromBase && pokemonCard.evolvesFromBase.length > 0) {
                result.evolvesFromBase = pokemonCard.evolvesFromBase;
            }
            if (pokemonCard.evolvesToStage && pokemonCard.evolvesToStage.length > 0) {
                result.evolvesToStage = pokemonCard.evolvesToStage;
            }
        }
        return result;
    }
    deserialize(data, context) {
        const index = data.index;
        const card = context.cards[index];
        if (card === undefined) {
            throw new GameError(GameCoreError.ERROR_SERIALIZER, `Card not found on index '${index}'.`);
        }
        // Restore runtime evolution flags from serialized state
        if (card instanceof PokemonCard) {
            const pokemonCard = card;
            if (Array.isArray(data.evolvesFromBase)) {
                pokemonCard.evolvesFromBase = data.evolvesFromBase;
            }
            if (Array.isArray(data.evolvesToStage)) {
                pokemonCard.evolvesToStage = data.evolvesToStage;
            }
        }
        return card;
    }
}
