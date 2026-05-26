import { Card } from './card/card';
import { PokemonCardList } from './state/pokemon-card-list';
import { Player } from './state/player';
/**
 * Service for tracking game statistics including prize counts and damage dealt by Pokemon
 */
export declare class GameStatsTracker {
    /**
     * Track when a player takes prize cards
     * @param player The player taking prizes
     * @param prizeCount Number of prizes taken
     */
    static trackPrizeTaken(player: Player, prizeCount: number): void;
    /**
     * Track damage dealt by a specific Pokemon
     * @param attackingPlayer The player whose Pokemon is dealing damage
     * @param attackingPokemon The Pokemon dealing damage
     * @param damage Amount of damage dealt
     */
    static trackDamageDealt(attackingPlayer: Player, attackingPokemon: PokemonCardList, damage: number): void;
    /**
     * Handle Pokemon evolution to maintain damage tracking continuity
     * @param player The player whose Pokemon is evolving
     * @param pokemonCardList The Pokemon card list that evolved
     * @param oldCard The Pokemon before evolution
     * @param newCard The Pokemon after evolution
     */
    static handlePokemonEvolution(player: Player, pokemonCardList: PokemonCardList, oldCard: Card, newCard: Card): void;
    /**
     * Calculate and update final statistics for the player
     * @param player The player to calculate stats for
     */
    static calculateFinalStats(player: Player): void;
    /**
     * Generate a unique identifier for a Pokemon considering its position and evolution
     * @param pokemonCardList The Pokemon card list
     * @returns Unique identifier string
     */
    private static generatePokemonId;
    /**
     * Assign a unique ID to a Pokemon card list for tracking purposes
     * @param pokemonCardList The Pokemon card list
     * @returns The assigned unique ID
     */
    private static assignUniqueIdToCardList;
    /**
     * Update the top Pokemon if the current Pokemon has higher damage
     * @param player The player
     * @param pokemonStats The Pokemon stats to check
     */
    private static updateTopPokemon;
}
