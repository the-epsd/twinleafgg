import { Component, Input, OnInit } from '@angular/core';
import { Card, GameWinner, GamePhase, SuperType } from 'ptcg-server';
import { LocalGameState } from '../../shared/session/session.interface';
import { GameOverPrompt } from '../prompt/prompt-game-over/game-over.prompt';
import { SessionService } from '../../shared/session/session.service';
import { Router } from '@angular/router';

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
  public topPokemon: PokemonDamageStats | null = null;

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Output the full game state for debugging
    console.log('Game state in game-over component:', this.gameState);
    console.log('Prompt:', this.prompt);

    if (this.gameState && this.gameState.state && this.gameState.state.players) {
      console.log('Player 0 data:', JSON.stringify(this.gameState.state.players[0], null, 2));
      console.log('Player 1 data:', JSON.stringify(this.gameState.state.players[1], null, 2));
    }

    this.calculateGameStats();
  }

  calculateGameStats(): void {
    if (!this.gameState || !this.gameState.state) {
      console.error('Game state not available');
      return;
    }

    const state = this.gameState.state;
    const currentPlayerId = this.sessionService.session.clientId;

    console.log('Current player ID:', currentPlayerId);
    console.log('Game state:', state);

    // Determine winner
    if (this.prompt.winner !== GameWinner.DRAW) {
      // Handle different winner enums (PLAYER_A vs PLAYER_1)
      const isPlayerA = this.prompt.winner === GameWinner.PLAYER_1 ||
        (this.prompt.winner as any) === 'PLAYER_A';
      const winningPlayerId = isPlayerA ? state.players[0].id : state.players[1].id;
      this.isWinner = String(currentPlayerId) === String(winningPlayerId);
      console.log('Winner determination:', {
        promptWinner: this.prompt.winner,
        isPlayerA,
        winningPlayerId,
        isWinner: this.isWinner
      });
    }

    // Set player usernames (use ID as fallback if username not available)
    const playerIndex = state.players.findIndex(p => String(p.id) === String(currentPlayerId));
    const opponentIndex = playerIndex === 0 ? 1 : 0;

    console.log('Player indices:', { playerIndex, opponentIndex });
    console.log('Player data:', state.players[playerIndex]);
    console.log('Opponent data:', state.players[opponentIndex]);

    this.playerUsername = state.players[playerIndex]?.name || `Player ${playerIndex + 1}`;
    this.opponentUsername = state.players[opponentIndex]?.name || `Player ${opponentIndex + 1}`;

    // Check if player went first - player at index 0 went first, so we need to reverse the logic
    // to match the React implementation
    this.wentFirst = playerIndex !== 0; // Reversed logic - player at index 0 went second

    // Calculate prizes taken
    // First try using the 'prizes' array length
    if (state.players[playerIndex] && state.players[playerIndex].prizes) {
      // Calculate based on remaining prizes (out of 6)
      this.playerPrizesTaken = 6 - state.players[playerIndex].prizes.length;
      console.log('Player prizes calculation (from prizes array):', {
        prizes: state.players[playerIndex].prizes,
        prizesLength: state.players[playerIndex].prizes.length,
        playerPrizesTaken: this.playerPrizesTaken
      });
    }

    if (state.players[opponentIndex] && state.players[opponentIndex].prizes) {
      this.opponentPrizesTaken = 6 - state.players[opponentIndex].prizes.length;
      console.log('Opponent prizes calculation (from prizes array):', {
        prizes: state.players[opponentIndex].prizes,
        prizesLength: state.players[opponentIndex].prizes.length,
        opponentPrizesTaken: this.opponentPrizesTaken
      });
    }

    // If values are still 0, try alternate properties
    if (this.playerPrizesTaken === 0 && state.players[playerIndex].prizesTaken !== undefined) {
      this.playerPrizesTaken = state.players[playerIndex].prizesTaken as number;
      console.log('Player prizes from prizesTaken property:', this.playerPrizesTaken);
    }

    if (this.opponentPrizesTaken === 0 && state.players[opponentIndex].prizesTaken !== undefined) {
      this.opponentPrizesTaken = state.players[opponentIndex].prizesTaken as number;
      console.log('Opponent prizes from prizesTaken property:', this.opponentPrizesTaken);
    }

    // For debugging, log the prize counts
    console.log('Player prizes taken:', this.playerPrizesTaken,
      'Opponent prizes taken:', this.opponentPrizesTaken);

    // Debug information for the first prize indicators
    console.log('First player prize indicator should be lit?', 0 < this.playerPrizesTaken);
    console.log('First opponent prize indicator should be lit?', 0 < this.opponentPrizesTaken);

    // Set placeholder values if still 0 and the game is over
    if (state.phase === GamePhase.FINISHED) {
      if (this.isWinner && this.playerPrizesTaken === 0) {
        // If player won but prizes count is 0, set to 6 (or at least 1)
        this.playerPrizesTaken = Math.max(1, this.playerPrizesTaken);
      }

      if (!this.isWinner && this.opponentPrizesTaken === 0) {
        // If opponent won but prizes count is 0, set to 6 (or at least 1)
        this.opponentPrizesTaken = Math.max(1, this.opponentPrizesTaken);
      }

      // After applying placeholder values, log again
      console.log('Final player prizes taken:', this.playerPrizesTaken,
        'Final opponent prizes taken:', this.opponentPrizesTaken);
    }

    // Ensure prize values are numbers
    this.playerPrizesTaken = Number(this.playerPrizesTaken);
    this.opponentPrizesTaken = Number(this.opponentPrizesTaken);

    // Log the final values
    console.log('FINAL player prizes (normalized):', this.playerPrizesTaken);
    console.log('FINAL opponent prizes (normalized):', this.opponentPrizesTaken);

    // Try to get damage stats if available
    this.findBestPokemon(playerIndex);
  }

  findBestPokemon(playerIndex: number): void {
    const player = this.gameState.state.players[playerIndex];

    if (!player) {
      return;
    }

    // Helper function to check if a card is a Pokémon
    const isPokemonCard = (card: Card): boolean => {
      return card.superType === SuperType.POKEMON;
    };

    // First try to use active Pokémon
    if (player.active && player.active.cards && player.active.cards.length > 0) {
      const card = player.active.cards[0];
      if (isPokemonCard(card)) {
        this.topPokemon = {
          card: card,
          damage: 50, // Placeholder damage value
          reason: 'damage'
        };
        return;
      }
    }

    // If no active Pokémon, try to use bench Pokémon
    if (player.bench && player.bench.length > 0) {
      for (const benchPokemon of player.bench) {
        if (benchPokemon.cards && benchPokemon.cards.length > 0) {
          const card = benchPokemon.cards[0];
          if (isPokemonCard(card)) {
            this.topPokemon = {
              card: card,
              damage: 30, // Placeholder damage value
              reason: 'damage'
            };
            return;
          }
        }
      }
    }

    // If no bench Pokémon, try to use Pokémon from discard pile
    if (player.discard) {
      try {
        // Look through discard pile for Pokémon cards
        const discardCards = player.discard.cards || [];
        for (const card of discardCards) {
          if (isPokemonCard(card)) {
            this.topPokemon = {
              card: card,
              damage: 0,
              reason: 'knockout'
            };
            return;
          }
        }
      } catch (e) {
        console.error('Error accessing discard pile:', e);
      }
    }
  }

  confirm(): void {
    this.router.navigate(['/']);
  }
} 