import { Component, Input, OnInit } from '@angular/core';
import { Card, GameWinner, GamePhase, SuperType } from 'ptcg-server';
import { LocalGameState, PlayerGameStats } from '../../shared/session/session.interface';
import { GameOverPrompt } from '../prompt/prompt-game-over/game-over.prompt';
import { SessionService } from '../../shared/session/session.service';
import { Router } from '@angular/router';
import { GameService } from 'src/app/api/services/game.service';
import { AlertService } from '../../shared/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';


interface PokemonDamageStats {
  card: Card;
  damage: number;
  reason?: 'damage' | 'knockout';
}

@Component({
  selector: 'ptcg-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent implements OnInit {
  @Input() prompt!: GameOverPrompt;
  @Input() gameState!: LocalGameState;

  public GameWinner = GameWinner;
  public isWinner = false;
  public wentFirst = false;
  public playerUsername = 'Player';
  public opponentUsername = 'Opponent';
  public playerPrizesTaken = 0;
  public opponentPrizesTaken = 0;
  public playerDamageDealt = 0;
  public opponentDamageDealt = 0;
  public topPokemon: PokemonDamageStats | null = null;
  public opponentTopPokemon: PokemonDamageStats | null = null;
  public isPlaying = false;
  public isDeleted = false;
  private gameId: number;
  private localId: number;

  // Enhanced statistics properties
  public playerStats: PlayerGameStats | null = null;
  public opponentStats: PlayerGameStats | null = null;

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private gameService: GameService,
    private alertService: AlertService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    // Set isPlaying and isDeleted
    this.isPlaying = this.checkPlaying(this.gameState, this.sessionService.session.clientId);
    this.isDeleted = this.gameState.deleted;
    this.gameId = this.gameState.gameId;
    this.localId = this.gameState.localId;

    this.calculateGameStats();
  }

  private checkPlaying(gameState: LocalGameState, clientId: number): boolean {
    if (gameState.replay || gameState.deleted) {
      return false;
    }
    return gameState.state.players.some(p => p.id === clientId);
  }

  calculateGameStats(): void {
    if (!this.gameState || !this.gameState.state) {
      return;
    }

    const state = this.gameState.state;
    const currentPlayerId = this.sessionService.session.clientId;

    // Determine winner
    if (this.prompt.winner !== GameWinner.DRAW) {
      // Handle different winner enums (PLAYER_A vs PLAYER_1)
      const isPlayerA = this.prompt.winner === GameWinner.PLAYER_1 ||
        (this.prompt.winner as any) === 'PLAYER_A';
      const winningPlayerId = isPlayerA ? state.players[0].id : state.players[1].id;
      this.isWinner = String(currentPlayerId) === String(winningPlayerId);
    }

    // Set player usernames (use ID as fallback if username not available)
    const playerIndex = state.players.findIndex(p => String(p.id) === String(currentPlayerId));
    const opponentIndex = playerIndex === 0 ? 1 : 0;

    this.playerUsername = state.players[playerIndex]?.name || `Player ${playerIndex + 1}`;
    this.opponentUsername = state.players[opponentIndex]?.name || `Player ${opponentIndex + 1}`;

    // Check if player went first - player at index 0 went first, so we need to reverse the logic
    // to match the React implementation
    this.wentFirst = playerIndex !== 0; // Reversed logic - player at index 0 went second

    // Use accurate statistics from server if available
    this.loadAccurateStatistics(playerIndex, opponentIndex);

    // Try to get damage stats if available
    this.findBestPokemon(playerIndex);
    this.findBestOpponentPokemon(opponentIndex);

    // Validate the loaded statistics
    this.validateStatistics();
  }

  private loadAccurateStatistics(playerIndex: number, opponentIndex: number): void {
    try {
      // First, try to use enhanced player stats from the server
      if (this.gameState.enhancedPlayerStats && this.gameState.enhancedPlayerStats.length >= 2) {
        this.playerStats = this.gameState.enhancedPlayerStats[playerIndex];
        this.opponentStats = this.gameState.enhancedPlayerStats[opponentIndex];

        // Use accurate prize counts from server statistics
        if (this.playerStats) {
          this.playerPrizesTaken = this.playerStats.prizesTakenCount;
          this.playerDamageDealt = this.playerStats.totalDamageDealt;
        }

        if (this.opponentStats) {
          this.opponentPrizesTaken = this.opponentStats.prizesTakenCount;
          this.opponentDamageDealt = this.opponentStats.totalDamageDealt;
        }

        return;
      }

      // Fallback: Try to use gameStats from individual players if available
      const player = this.gameState.state.players[playerIndex];
      const opponent = this.gameState.state.players[opponentIndex];

      if (player && (player as any).gameStats) {
        const playerGameStats = (player as any).gameStats;
        this.playerPrizesTaken = playerGameStats.prizesTakenCount || 0;
        this.playerDamageDealt = playerGameStats.totalDamageDealt || 0;

        // Create PlayerGameStats object for consistency
        this.playerStats = {
          prizesTakenCount: this.playerPrizesTaken,
          totalDamageDealt: this.playerDamageDealt,
          topPokemon: playerGameStats.topPokemon || null
        };
      }

      if (opponent && (opponent as any).gameStats) {
        const opponentGameStats = (opponent as any).gameStats;
        this.opponentPrizesTaken = opponentGameStats.prizesTakenCount || 0;

        // Create PlayerGameStats object for consistency
        this.opponentStats = {
          prizesTakenCount: this.opponentPrizesTaken,
          totalDamageDealt: opponentGameStats.totalDamageDealt || 0,
          topPokemon: opponentGameStats.topPokemon || null
        };
        this.opponentDamageDealt = this.opponentStats.totalDamageDealt;
      }

      // If we got stats from gameStats, we're done
      if (this.playerStats || this.opponentStats) {
        return;
      }

      // Final fallback: Use traditional prize calculation but WITHOUT artificial inflation
      this.calculateFallbackPrizeStats(playerIndex, opponentIndex);

    } catch (error) {
      // Use fallback calculation on error
      this.calculateFallbackPrizeStats(playerIndex, opponentIndex);
    }
  }

  private calculateFallbackPrizeStats(playerIndex: number, opponentIndex: number): void {

    const state = this.gameState.state;

    // Calculate prizes taken based on remaining prizes (without artificial inflation)
    if (state.players[playerIndex] && state.players[playerIndex].prizes) {
      this.playerPrizesTaken = 6 - state.players[playerIndex].prizes.length;
    }

    if (state.players[opponentIndex] && state.players[opponentIndex].prizes) {
      this.opponentPrizesTaken = 6 - state.players[opponentIndex].prizes.length;
    }

    // Try alternate properties if available
    if (this.playerPrizesTaken === 0 && state.players[playerIndex].prizesTaken !== undefined) {
      this.playerPrizesTaken = state.players[playerIndex].prizesTaken as number;
    }

    if (this.opponentPrizesTaken === 0 && state.players[opponentIndex].prizesTaken !== undefined) {
      this.opponentPrizesTaken = state.players[opponentIndex].prizesTaken as number;
    }

    // REMOVED: Artificial prize inflation logic
    // The old code would set prizes to at least 1 for winners, but this is inaccurate
    // We now preserve the actual prize counts regardless of game outcome

    // Ensure prize values are numbers
    this.playerPrizesTaken = Number(this.playerPrizesTaken) || 0;
    this.opponentPrizesTaken = Number(this.opponentPrizesTaken) || 0;

    // Create basic PlayerGameStats objects for consistency
    this.playerStats = {
      prizesTakenCount: this.playerPrizesTaken,
      totalDamageDealt: 0, // No damage data available in fallback
      topPokemon: null
    };

    this.opponentStats = {
      prizesTakenCount: this.opponentPrizesTaken,
      totalDamageDealt: 0, // No damage data available in fallback
      topPokemon: null
    };

    // Set damage values for consistency
    this.playerDamageDealt = 0;
    this.opponentDamageDealt = 0;
  }

  findBestPokemon(playerIndex: number): void {
    try {
      // First, try to use accurate top Pokemon from server statistics
      if (this.playerStats && this.playerStats.topPokemon) {
        // Ensure we're using the final evolved form from server statistics
        const topPokemonCard = this.playerStats.topPokemon.card;

        // Validate that the card is properly structured
        if (topPokemonCard && this.isValidPokemonCard(topPokemonCard)) {
          this.topPokemon = {
            card: topPokemonCard, // This should already be the final evolved form
            damage: this.playerStats.topPokemon.totalDamage,
            reason: 'damage'
          };
          return;
        } else {
          // Invalid top Pokemon card from server statistics, falling back
        }
      }

      // Fallback to traditional Pokemon finding logic with evolution handling
      this.findFallbackPokemon(playerIndex);

    } catch (error) {
      // Use fallback on error
      this.findFallbackPokemon(playerIndex);
    }
  }

  private findFallbackPokemon(playerIndex: number): void {
    const player = this.gameState.state.players[playerIndex];

    if (!player) {
      return;
    }

    // Try to find the best Pokemon using evolution-aware logic
    const bestPokemon = this.findBestPokemonWithEvolution(player);

    if (bestPokemon) {
      this.topPokemon = {
        card: bestPokemon,
        damage: 0, // No accurate damage data available in fallback
        reason: 'damage'
      };
    }
  }

  findBestOpponentPokemon(opponentIndex: number): void {
    try {
      // First, try to use accurate top Pokemon from server statistics
      if (this.opponentStats && this.opponentStats.topPokemon) {
        // Ensure we're using the final evolved form from server statistics
        const topPokemonCard = this.opponentStats.topPokemon.card;

        // Validate that the card is properly structured
        if (topPokemonCard && this.isValidPokemonCard(topPokemonCard)) {
          this.opponentTopPokemon = {
            card: topPokemonCard, // This should already be the final evolved form
            damage: this.opponentStats.topPokemon.totalDamage,
            reason: 'damage'
          };
          return;
        } else {
          // Invalid opponent top Pokemon card from server statistics, falling back
        }
      }

      // Fallback to traditional Pokemon finding logic with evolution handling
      this.findFallbackOpponentPokemon(opponentIndex);

    } catch (error) {
      // Use fallback on error
      this.findFallbackOpponentPokemon(opponentIndex);
    }
  }

  private findFallbackOpponentPokemon(opponentIndex: number): void {
    const opponent = this.gameState.state.players[opponentIndex];

    if (!opponent) {
      return;
    }

    // Try to find the best Pokemon using evolution-aware logic
    const bestPokemon = this.findBestPokemonWithEvolution(opponent);

    if (bestPokemon) {
      this.opponentTopPokemon = {
        card: bestPokemon,
        damage: 0, // No accurate damage data available in fallback
        reason: 'damage'
      };
    }
  }

  /**
   * Checks if we have accurate statistics from the server
   */
  public hasAccurateStatistics(): boolean {
    return !!(this.gameState.enhancedPlayerStats ||
      (this.gameState.state.players[0] as any)?.gameStats ||
      (this.gameState.state.players[1] as any)?.gameStats);
  }

  /**
   * Checks if we have accurate damage statistics specifically
   */
  public hasAccurateDamageStats(): boolean {
    return this.hasAccurateStatistics() && (
      (this.playerStats && this.playerStats.totalDamageDealt !== undefined) ||
      (this.opponentStats && this.opponentStats.totalDamageDealt !== undefined)
    );
  }

  /**
   * Gets display text for damage values, handling zero and undefined cases
   */
  public getDamageDisplayText(damage: number): string {
    if (damage === undefined || damage === null) {
      return this.hasAccurateDamageStats() ? '0' : 'Unknown';
    }
    return damage.toString();
  }

  /**
   * Gets display text for Pokemon damage, handling zero and undefined cases
   */
  public getPokemonDamageDisplayText(pokemon: PokemonDamageStats | null): string {
    if (!pokemon) {
      return 'No Pokémon found';
    }
    if (pokemon.damage === undefined || pokemon.damage === null) {
      return this.hasAccurateDamageStats() ? 'No damage dealt' : 'Damage unknown';
    }
    if (pokemon.damage === 0) {
      return 'No damage dealt';
    }
    return `${pokemon.damage} damage dealt`;
  }

  /**
   * Validates that a card is a valid Pokemon card
   * @param card The card to validate
   * @returns True if the card is a valid Pokemon card
   */
  private isValidPokemonCard(card: Card): boolean {
    return card &&
      card.superType === SuperType.POKEMON &&
      card.name &&
      card.name.trim().length > 0;
  }

  /**
   * Finds the best Pokemon for a player, prioritizing evolved forms
   * @param player The player to find Pokemon for
   * @returns The best Pokemon card or null if none found
   */
  private findBestPokemonWithEvolution(player: any): Card | null {
    const pokemonCandidates: Card[] = [];

    // Helper function to check if a card is a Pokémon
    const isPokemonCard = (card: Card): boolean => {
      return card.superType === SuperType.POKEMON;
    };

    // Helper function to get the top card from a card list (evolved form)
    const getTopCard = (cardList: any): Card | null => {
      if (cardList && cardList.cards && cardList.cards.length > 0) {
        // The top card in the stack is the most evolved form
        const topCard = cardList.cards[cardList.cards.length - 1];
        return isPokemonCard(topCard) ? topCard : null;
      }
      return null;
    };

    // First priority: Active Pokémon (get the evolved form)
    if (player.active) {
      const activeCard = getTopCard(player.active);
      if (activeCard) {
        pokemonCandidates.push(activeCard);
      }
    }

    // Second priority: Bench Pokémon (get evolved forms)
    if (player.bench && player.bench.length > 0) {
      for (const benchPokemon of player.bench) {
        const benchCard = getTopCard(benchPokemon);
        if (benchCard) {
          pokemonCandidates.push(benchCard);
        }
      }
    }

    // Third priority: Pokémon from discard pile (may include evolved forms)
    if (player.discard) {
      try {
        const discardCards = player.discard.cards || [];
        for (const card of discardCards) {
          if (isPokemonCard(card)) {
            pokemonCandidates.push(card);
          }
        }
      } catch (e) {
        // Error accessing discard pile
      }
    }

    // Return the best candidate (prioritize by evolution stage and rarity)
    return this.selectBestPokemonCandidate(pokemonCandidates);
  }

  /**
   * Selects the best Pokemon from a list of candidates, prioritizing evolved forms
   * @param candidates Array of Pokemon cards to choose from
   * @returns The best Pokemon card or null if none available
   */
  private selectBestPokemonCandidate(candidates: Card[]): Card | null {
    if (candidates.length === 0) {
      return null;
    }

    if (candidates.length === 1) {
      return candidates[0];
    }

    // Sort candidates by preference:
    // 1. Evolution stage (higher is better)
    // 2. HP (higher is better)
    // 3. Name (for consistency)
    const sortedCandidates = candidates.sort((a, b) => {
      // Try to determine evolution stage from card properties
      const aStage = this.getEvolutionStage(a);
      const bStage = this.getEvolutionStage(b);

      if (aStage !== bStage) {
        return bStage - aStage; // Higher stage first
      }

      // If same stage, prefer higher HP
      const aHp = this.getCardHp(a);
      const bHp = this.getCardHp(b);

      if (aHp !== bHp) {
        return bHp - aHp; // Higher HP first
      }

      // If same HP, sort by name for consistency
      return a.name.localeCompare(b.name);
    });

    return sortedCandidates[0];
  }

  /**
   * Attempts to determine the evolution stage of a Pokemon card
   * @param card The Pokemon card
   * @returns Estimated evolution stage (0 = basic, 1 = stage 1, 2 = stage 2, etc.)
   */
  private getEvolutionStage(card: Card): number {
    // This is a heuristic approach since we don't have direct access to evolution stage
    const cardName = card.name.toLowerCase();

    // Check for common evolution indicators
    if (cardName.includes('ex') || cardName.includes('gx') || cardName.includes('v')) {
      return 3; // Special/powerful cards get high priority
    }

    // Check for stage indicators in the card text or properties
    if ((card as any).stage) {
      const stage = (card as any).stage.toLowerCase();
      if (stage.includes('stage 2') || stage.includes('stage2')) return 2;
      if (stage.includes('stage 1') || stage.includes('stage1')) return 1;
      if (stage.includes('basic')) return 0;
    }

    // Fallback: use HP as a rough indicator (higher HP often means more evolved)
    const hp = this.getCardHp(card);
    if (hp >= 200) return 3;
    if (hp >= 150) return 2;
    if (hp >= 100) return 1;
    return 0;
  }

  /**
   * Gets the HP value of a Pokemon card
   * @param card The Pokemon card
   * @returns HP value or 0 if not available
   */
  private getCardHp(card: Card): number {
    if ((card as any).hp && typeof (card as any).hp === 'number') {
      return (card as any).hp;
    }

    // Try to parse HP from string if it's stored as text
    if ((card as any).hp && typeof (card as any).hp === 'string') {
      const hpMatch = (card as any).hp.match(/\d+/);
      if (hpMatch) {
        return parseInt(hpMatch[0], 10);
      }
    }

    return 0;
  }

  /**
   * Validates that the statistics data is consistent and logs any issues
   */
  private validateStatistics(): void {
    try {
      // Validate prize counts are within expected range (0-6)
      if (this.playerPrizesTaken < 0 || this.playerPrizesTaken > 6) {
        // Invalid player prize count
      }

      if (this.opponentPrizesTaken < 0 || this.opponentPrizesTaken > 6) {
        // Invalid opponent prize count
      }

      // Validate damage values are non-negative
      if (this.playerDamageDealt < 0) {
        this.playerDamageDealt = 0;
      }

      if (this.opponentDamageDealt < 0) {
        this.opponentDamageDealt = 0;
      }

      // Validate Pokemon card data
      if (this.topPokemon && !this.isValidPokemonCard(this.topPokemon.card)) {
        // Invalid player top Pokemon card
      }

      if (this.opponentTopPokemon && !this.isValidPokemonCard(this.opponentTopPokemon.card)) {
        // Invalid opponent top Pokemon card
      }

    } catch (error) {
      // Error validating statistics
    }
  }

  /**
   * Gets a safe display name for a Pokemon card, handling missing or invalid data
   * @param pokemon The Pokemon stats object
   * @returns A safe display name
   */
  public getSafePokemonName(pokemon: PokemonDamageStats | null): string {
    if (!pokemon || !pokemon.card) {
      return 'Unknown Pokémon';
    }

    if (!pokemon.card.name || pokemon.card.name.trim().length === 0) {
      return 'Unnamed Pokémon';
    }

    return pokemon.card.name;
  }

  /**
   * Checks if a Pokemon card has valid image data
   * @param pokemon The Pokemon stats object
   * @returns True if the card should be displayable
   */
  public hasValidCardImage(pokemon: PokemonDamageStats | null): boolean {
    if (!pokemon || !pokemon.card) {
      return false;
    }

    // Check if the card has the minimum required properties for display
    return this.isValidPokemonCard(pokemon.card) &&
      pokemon.card.name &&
      pokemon.card.name.trim().length > 0;
  }

  /**
   * Gets fallback card data when the primary card is invalid
   * @param playerIndex The player index to get fallback for
   * @returns A fallback Pokemon card or null
   */
  public getFallbackCard(playerIndex: number): Card | null {
    try {
      const player = this.gameState.state.players[playerIndex];
      if (!player) {
        return null;
      }

      // Try to find any valid Pokemon card as a fallback
      return this.findBestPokemonWithEvolution(player);
    } catch (error) {
      return null;
    }
  }

  confirm(): void {
    this.gameService.removeLocalGameState(this.localId);
    this.router.navigate(['/']);
    this.isDeleted = true;
  }
} 