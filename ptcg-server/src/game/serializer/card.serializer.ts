import { SerializerContext, Serialized, Serializer } from './serializer.interface';
import { Card } from '../store/card/card';
import { PokemonCard } from '../store/card/pokemon-card';
import { GameError } from '../game-error';
import { GameCoreError } from '../game-message';

export class CardSerializer implements Serializer<Card> {

  public readonly types = ['Card'];
  public readonly classes = [Card];

  constructor () { }

  public serialize(card: Card): Serialized {
    const index = card.id;
    if (index === -1) {
      throw new GameError(GameCoreError.ERROR_SERIALIZER, `Card not found '${card.fullName}'.`);
    }

    const result: Serialized = { _type: 'Card', index };

    // Persist runtime evolution flags for PokemonCard (evolvesFromBase, evolvesToStage)
    // so they survive serialization and reach the client for 3D board hover effects
    if (card instanceof PokemonCard) {
      const pokemonCard = card as PokemonCard;
      if (pokemonCard.evolvesFromBase && pokemonCard.evolvesFromBase.length > 0) {
        result.evolvesFromBase = pokemonCard.evolvesFromBase;
      }
      if (pokemonCard.evolvesToStage && pokemonCard.evolvesToStage.length > 0) {
        result.evolvesToStage = pokemonCard.evolvesToStage;
      }
    }

    return result;
  }

  public deserialize(data: Serialized, context: SerializerContext): Card {
    const index: number = data.index;
    const card = context.cards[index];
    if (card === undefined) {
      throw new GameError(GameCoreError.ERROR_SERIALIZER, `Card not found on index '${index}'.`);
    }

    // Restore runtime evolution flags from serialized state
    if (card instanceof PokemonCard) {
      const pokemonCard = card as PokemonCard;
      if (Array.isArray((data as any).evolvesFromBase)) {
        pokemonCard.evolvesFromBase = (data as any).evolvesFromBase;
      }
      if (Array.isArray((data as any).evolvesToStage)) {
        pokemonCard.evolvesToStage = (data as any).evolvesToStage;
      }
    }

    return card;
  }

}
