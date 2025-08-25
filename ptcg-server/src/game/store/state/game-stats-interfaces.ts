import { Card } from '../card/card';

/**
 * Interface for tracking prize-related data throughout the game
 */
export interface PrizeTrackingData {
  playerId: number;
  prizesTaken: number;
  prizeTakingEvents: {
    turn: number;
    prizeCount: number;
    reason: 'knockout' | 'effect' | 'automatic';
  }[];
}

/**
 * Interface for tracking damage dealt by individual Pokemon
 */
export interface DamageTrackingData {
  pokemonId: string;
  pokemonName: string;
  evolutionChain: Card[];
  damageEvents: {
    turn: number;
    damage: number;
    target: string;
  }[];
  totalDamage: number;
}

/**
 * Interface for tracking Pokemon evolution and maintaining damage continuity
 */
export interface EvolutionTrackingData {
  originalCardId: string;
  evolutionChain: {
    card: Card;
    turn: number;
  }[];
  currentCard: Card;
  damageCarriedOver: number;
}

/**
 * Interface for per-Pokemon damage statistics
 */
export interface PokemonDamageStats {
  cardId: string;
  cardName: string;
  totalDamage: number;
  evolutionChain: string[];
  finalEvolution: Card;
}

/**
 * Interface for the top-performing Pokemon
 */
export interface TopPokemonStats {
  cardId: string;
  card: Card;
  totalDamage: number;
}

/**
 * Main game statistics interface for a player
 */
export interface GameStats {
  prizesTakenCount: number;
  totalDamageDealt: number;
  pokemonDamageStats: { [key: string]: PokemonDamageStats };
  topPokemon: TopPokemonStats | null;
}