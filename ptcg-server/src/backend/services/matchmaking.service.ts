import { Format, GameSettings, Rules } from '../../game';
import { Core } from '../../game/core/core';
import { Client } from '../../game/client/client.interface';
import { SocketWrapper } from '../socket/socket-wrapper';

interface QueuedPlayer {
  client: Client;
  socketWrapper: SocketWrapper;
  format: Format;
  deck: string[];
  joinedAt: number;
  lastValidated: number;
}

export class MatchmakingService {
  private static instance: MatchmakingService;
  private queue: QueuedPlayer[] = [];
  private matchCheckInterval: NodeJS.Timeout;
  private validateInterval: NodeJS.Timeout;
  private readonly CHECK_INTERVAL = 2000; // Check for matches every 2 seconds
  private readonly VALIDATE_INTERVAL = 30000; // Validate connections every 30 seconds
  private readonly MAX_QUEUE_TIME = 300000; // 5 minutes maximum in queue

  private constructor(private core: Core) {
    this.matchCheckInterval = setInterval(() => this.checkMatches(), this.CHECK_INTERVAL);
    this.validateInterval = setInterval(() => this.validateQueue(), this.VALIDATE_INTERVAL);
  }

  public static getInstance(core: Core): MatchmakingService {
    if (!MatchmakingService.instance) {
      MatchmakingService.instance = new MatchmakingService(core);
    }
    return MatchmakingService.instance;
  }

  public addToQueue(client: Client, socketWrapper: SocketWrapper, format: Format, deck: string[]): void {
    // Remove if already in queue
    this.removeFromQueue(client);

    // Validate deck before adding to queue
    if (!Array.isArray(deck) || deck.length === 0) {
      throw new Error('Invalid deck');
    }

    this.queue.push({
      client,
      socketWrapper,
      format,
      deck,
      joinedAt: Date.now(),
      lastValidated: Date.now()
    });

    this.broadcastQueueUpdate();
  }

  public removeFromQueue(client: Client): void {
    const wasInQueue = this.queue.some(p => p.client === client);
    this.queue = this.queue.filter(p => p.client !== client);

    if (wasInQueue) {
      this.broadcastQueueUpdate();
    }
  }

  public getQueuedPlayers(): string[] {
    return this.queue.map(p => p.client.name);
  }

  public isPlayerInQueue(client: Client): boolean {
    return this.queue.some(p => p.client === client);
  }

  private broadcastQueueUpdate(): void {
    const players = this.getQueuedPlayers();
    this.queue.forEach(p => {
      p.socketWrapper.emit('matchmaking:queueUpdate', { players });
    });
  }

  private validateQueue(): void {
    const now = Date.now();
    const playersToRemove: Client[] = [];

    // Check for stale connections or players who have been in queue too long
    this.queue.forEach(player => {
      // Remove if in queue too long
      if (now - player.joinedAt > this.MAX_QUEUE_TIME) {
        playersToRemove.push(player.client);
        return;
      }

      // Validate socket is still connected
      const isConnected = player.socketWrapper.socket.connected;
      if (!isConnected) {
        playersToRemove.push(player.client);
      } else {
        player.lastValidated = now;
      }
    });

    // Remove invalid players
    playersToRemove.forEach(client => {
      this.removeFromQueue(client);
    });

    // Send queue update if players were removed
    if (playersToRemove.length > 0) {
      this.broadcastQueueUpdate();
    }
  }

  private checkMatches(): void {
    if (this.queue.length < 2) return;

    // Group players by format
    const formatGroups = new Map<Format, QueuedPlayer[]>();
    this.queue.forEach(player => {
      const players = formatGroups.get(player.format) || [];
      players.push(player);
      formatGroups.set(player.format, players);
    });

    // Check each format group for potential matches
    formatGroups.forEach(players => {
      if (players.length < 2) return;

      // Sort by time in queue
      players.sort((a, b) => a.joinedAt - b.joinedAt);

      // Match first two players
      const player1 = players[0];
      const player2 = players[1];

      // Verify both players are still connected and in the core
      const isPlayer1Connected = player1.socketWrapper.socket.connected &&
        this.core.clients.some(c => c.id === player1.client.id);
      const isPlayer2Connected = player2.socketWrapper.socket.connected &&
        this.core.clients.some(c => c.id === player2.client.id);

      if (!isPlayer1Connected || !isPlayer2Connected) {
        // Remove disconnected players
        if (!isPlayer1Connected) {
          console.log(`[Matchmaking] Removing disconnected player ${player1.client.name} from queue`);
          this.removeFromQueue(player1.client);
        }
        if (!isPlayer2Connected) {
          console.log(`[Matchmaking] Removing disconnected player ${player2.client.name} from queue`);
          this.removeFromQueue(player2.client);
        }
        return;
      }

      try {
        // Create game settings
        const gameSettings: GameSettings = {
          format: player1.format,
          timeLimit: 1800,
          rules: new Rules(),
          recordingEnabled: true
        };

        console.log(`[Matchmaking] Creating game between ${player1.client.name} and ${player2.client.name}`);

        // Use createGameWithDecks instead of createGame
        const game = this.core.createGameWithDecks(
          player1.client,
          player1.deck,
          gameSettings,
          player2.client,
          player2.deck
        );

        if (game) {
          console.log(`[Matchmaking] Game ${game.id} created successfully`);

          // Notify players
          console.log(`[Matchmaking] Notifying ${player1.client.name} about game ${game.id}`);
          player1.socketWrapper.emit('matchmaking:gameCreated', { gameId: game.id });

          console.log(`[Matchmaking] Notifying ${player2.client.name} about game ${game.id}`);
          player2.socketWrapper.emit('matchmaking:gameCreated', { gameId: game.id });

          // Remove matched players from queue
          this.removeFromQueue(player1.client);
          this.removeFromQueue(player2.client);
        } else {
          console.log(`[Matchmaking] Failed to create game between ${player1.client.name} and ${player2.client.name}`);
          // Remove players from queue if there was an error
          this.removeFromQueue(player1.client);
          this.removeFromQueue(player2.client);
        }
      } catch (error) {
        console.error(`[Matchmaking] Error creating game: ${error}`);
        // Remove players from queue if there was an error
        this.removeFromQueue(player1.client);
        this.removeFromQueue(player2.client);
      }
    });
  }

  public dispose(): void {
    if (this.matchCheckInterval) {
      clearInterval(this.matchCheckInterval);
    }
    if (this.validateInterval) {
      clearInterval(this.validateInterval);
    }
    // Clear queue on dispose
    this.queue = [];
  }
}