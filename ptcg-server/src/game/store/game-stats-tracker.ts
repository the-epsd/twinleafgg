import { Card } from './card/card';
import { PokemonCard } from './card/pokemon-card';
import { PokemonCardList } from './state/pokemon-card-list';
import { Player } from './state/player';
import { PokemonDamageStats, TopPokemonStats } from './state/game-stats-interfaces';

/**
 * Service for tracking game statistics including prize counts and damage dealt by Pokemon
 */
export class GameStatsTracker {

  /**
   * Track when a player takes prize cards
   * @param player The player taking prizes
   * @param prizeCount Number of prizes taken
   */
  static trackPrizeTaken(player: Player, prizeCount: number): void {
    if (prizeCount <= 0) {
      return;
    }

    // Update the accurate prize count
    player.gameStats.prizesTakenCount += prizeCount;
  }

  /**
   * Track damage dealt by a specific Pokemon
   * @param attackingPlayer The player whose Pokemon is dealing damage
   * @param attackingPokemon The Pokemon dealing damage
   * @param damage Amount of damage dealt
   */
  static trackDamageDealt(
    attackingPlayer: Player,
    attackingPokemon: PokemonCardList,
    damage: number
  ): void {
    if (damage <= 0) {
      return;
    }

    const pokemonCard = attackingPokemon.getPokemonCard();
    if (!pokemonCard) {
      return;
    }

    // Generate a unique ID for this Pokemon (considering evolution chain)
    const pokemonId = this.generatePokemonId(attackingPokemon);

    // Get or create damage stats for this Pokemon
    let pokemonStats = attackingPlayer.gameStats.pokemonDamageStats[pokemonId];
    if (!pokemonStats) {
      pokemonStats = {
        cardId: pokemonId,
        cardName: pokemonCard.name,
        totalDamage: 0,
        evolutionChain: [pokemonCard.name],
        finalEvolution: pokemonCard
      };
      attackingPlayer.gameStats.pokemonDamageStats[pokemonId] = pokemonStats;
    } else {
      // Update evolution chain if this Pokemon has evolved since last damage tracking
      if (!pokemonStats.evolutionChain.includes(pokemonCard.name)) {
        pokemonStats.evolutionChain.push(pokemonCard.name);
      }
      // Always keep the current evolved form
      pokemonStats.finalEvolution = pokemonCard;
      pokemonStats.cardName = pokemonCard.name;
    }

    // Update damage stats
    pokemonStats.totalDamage += damage;

    // Update player's total damage dealt
    attackingPlayer.gameStats.totalDamageDealt += damage;

    // Update top Pokemon if this one now has the highest damage
    this.updateTopPokemon(attackingPlayer, pokemonStats);
  }

  /**
   * Handle Pokemon evolution to maintain damage tracking continuity
   * @param player The player whose Pokemon is evolving
   * @param pokemonCardList The Pokemon card list that evolved
   * @param oldCard The Pokemon before evolution
   * @param newCard The Pokemon after evolution
   */
  static handlePokemonEvolution(
    player: Player,
    pokemonCardList: PokemonCardList,
    oldCard: Card,
    newCard: Card
  ): void {
    if (!(oldCard instanceof PokemonCard) || !(newCard instanceof PokemonCard)) {
      return;
    }

    // Generate the Pokemon ID for this card list
    const pokemonId = this.generatePokemonId(pokemonCardList);
    let stats = player.gameStats.pokemonDamageStats[pokemonId];

    if (stats) {
      // Update existing stats for evolved Pokemon
      if (!stats.evolutionChain.includes(newCard.name)) {
        stats.evolutionChain.push(newCard.name);
      }

      // Update the final evolution to the new card
      stats.finalEvolution = newCard;
      stats.cardName = newCard.name; // Update the display name to the evolved form

      // Update top Pokemon reference if this was the top Pokemon
      if (player.gameStats.topPokemon && player.gameStats.topPokemon.cardId === pokemonId) {
        player.gameStats.topPokemon.card = newCard;
      }
    } else {
      // Create new stats entry for Pokemon that evolved before dealing damage
      // This ensures we maintain evolution chain history even if no damage was dealt yet
      stats = {
        cardId: pokemonId,
        cardName: newCard.name,
        totalDamage: 0,
        evolutionChain: [oldCard.name, newCard.name],
        finalEvolution: newCard
      };
      player.gameStats.pokemonDamageStats[pokemonId] = stats;
    }
  }

  /**
   * Calculate and update final statistics for the player
   * @param player The player to calculate stats for
   */
  static calculateFinalStats(player: Player): void {
    // Find the Pokemon with the highest damage
    let topPokemon: TopPokemonStats | null = null;
    let maxDamage = 0;

    for (const [pokemonId, stats] of Object.entries(player.gameStats.pokemonDamageStats)) {
      if (stats.totalDamage > maxDamage) {
        maxDamage = stats.totalDamage;
        topPokemon = {
          cardId: pokemonId,
          card: stats.finalEvolution,
          totalDamage: stats.totalDamage
        };
      }
    }

    player.gameStats.topPokemon = topPokemon;
  }

  /**
   * Generate a unique identifier for a Pokemon considering its position and evolution
   * @param pokemonCardList The Pokemon card list
   * @returns Unique identifier string
   */
  private static generatePokemonId(pokemonCardList: PokemonCardList): string {
    const pokemonCard = pokemonCardList.getPokemonCard();
    if (!pokemonCard) {
      return 'unknown';
    }

    // Use the card list as the primary identifier to maintain consistency through evolution
    // This ensures the same Pokemon position gets the same ID even after evolution
    const cardListId = (pokemonCardList as any).__uniqueId || this.assignUniqueIdToCardList(pokemonCardList);
    return `pokemon_list_${cardListId}`;
  }



  /**
   * Assign a unique ID to a Pokemon card list for tracking purposes
   * @param pokemonCardList The Pokemon card list
   * @returns The assigned unique ID
   */
  private static assignUniqueIdToCardList(pokemonCardList: any): string {
    if (!pokemonCardList.__uniqueId) {
      pokemonCardList.__uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return pokemonCardList.__uniqueId;
  }

  /**
   * Update the top Pokemon if the current Pokemon has higher damage
   * @param player The player
   * @param pokemonStats The Pokemon stats to check
   */
  private static updateTopPokemon(player: Player, pokemonStats: PokemonDamageStats): void {
    if (!player.gameStats.topPokemon || pokemonStats.totalDamage > player.gameStats.topPokemon.totalDamage) {
      player.gameStats.topPokemon = {
        cardId: pokemonStats.cardId,
        card: pokemonStats.finalEvolution,
        totalDamage: pokemonStats.totalDamage
      };
    }
  }
}