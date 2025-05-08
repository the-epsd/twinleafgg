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
  private readonly BOT_MATCH_TIMEOUT = 10000; // 10 seconds before matching with bot
  private botMatchTimeouts: Map<Client, NodeJS.Timeout> = new Map();

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
    try {
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

      // Set timeout for bot matching
      const timeout = setTimeout(() => {
        this.tryMatchWithBot(client, format);
      }, this.BOT_MATCH_TIMEOUT);

      this.botMatchTimeouts.set(client, timeout);

      this.broadcastQueueUpdate();
    } catch (error) {
      console.error('[Matchmaking] Error adding player to queue:', error);
    }
  }

  public removeFromQueue(client: Client): void {
    try {
      const wasInQueue = this.queue.some(p => p.client === client);
      this.queue = this.queue.filter(p => p.client !== client);

      // Clear bot match timeout if exists
      const timeout = this.botMatchTimeouts.get(client);
      if (timeout) {
        clearTimeout(timeout);
        this.botMatchTimeouts.delete(client);
      }

      if (wasInQueue) {
        console.log(`[Matchmaking] Player ${client.name} removed from queue`);
        this.broadcastQueueUpdate();
      }
    } catch (error) {
      console.error('[Matchmaking] Error removing player from queue:', error);
    }
  }

  public getQueuedPlayers(): string[] {
    return this.queue.map(p => p.client.name);
  }

  public isPlayerInQueue(client: Client): boolean {
    return this.queue.some(p => p.client === client);
  }

  private broadcastQueueUpdate(): void {
    try {
      const players = this.getQueuedPlayers();
      this.queue.forEach(p => {
        try {
          p.socketWrapper.emit('matchmaking:queueUpdate', { players });
        } catch (error) {
          console.error(`[Matchmaking] Error broadcasting to player ${p.client.name}:`, error);
        }
      });
    } catch (error) {
      console.error('[Matchmaking] Error broadcasting queue update:', error);
    }
  }

  private validateQueue(): void {
    try {
      const now = Date.now();
      const playersToRemove: Client[] = [];

      // Check for stale connections or players who have been in queue too long
      this.queue.forEach(player => {
        // Remove if in queue too long
        if (now - player.joinedAt > this.MAX_QUEUE_TIME) {
          console.log(`[Matchmaking] Player ${player.client.name} removed from queue - exceeded maximum queue time`);
          playersToRemove.push(player.client);
          return;
        }

        // Validate socket is still connected
        try {
          const isConnected = player.socketWrapper.isConnected();
          if (!isConnected) {
            console.log(`[Matchmaking] Player ${player.client.name} removed from queue - socket disconnected`);
            playersToRemove.push(player.client);
          } else {
            player.lastValidated = now;
          }
        } catch (error) {
          console.error(`[Matchmaking] Error validating connection for ${player.client.name}:`, error);
          playersToRemove.push(player.client);
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
    } catch (error) {
      console.error('[Matchmaking] Error validating queue:', error);
    }
  }

  private checkMatches(): void {
    try {
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

        // Verify both players are still connected
        if (!player1.socketWrapper.isConnected() || !player2.socketWrapper.isConnected()) {
          // Remove disconnected players
          if (!player1.socketWrapper.isConnected()) {
            this.removeFromQueue(player1.client);
          }
          if (!player2.socketWrapper.isConnected()) {
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

          // Use createGameWithDecks instead of createGame
          const game = this.core.createGameWithDecks(
            player1.client,
            player1.deck,
            gameSettings,
            player2.client,
            player2.deck
          );

          if (game) {
            console.log(`[Matchmaking] Created game #${game.id} for ${player1.client.name} vs ${player2.client.name}`);

            // Notify players
            player1.socketWrapper.emit('matchmaking:gameCreated', { gameId: game.id });
            player2.socketWrapper.emit('matchmaking:gameCreated', { gameId: game.id });

            // Remove matched players from queue
            this.removeFromQueue(player1.client);
            this.removeFromQueue(player2.client);
          }
        } catch (error) {
          console.error('[Matchmaking] Error creating game:', error);
          // Remove players from queue if there was an error
          this.removeFromQueue(player1.client);
          this.removeFromQueue(player2.client);
        }
      });
    } catch (error) {
      console.error('[Matchmaking] Error checking matches:', error);
    }
  }

  private async tryMatchWithBot(player: Client, format: Format): Promise<void> {
    try {
      // Check if player is still in queue
      const queuedPlayer = this.queue.find(p => p.client === player);
      if (!queuedPlayer) return;

      // Get available bots for this format
      const botManager = this.core.getBotManager();
      const availableBots = botManager.getBotsForFormat(format);

      if (availableBots.length === 0) {
        console.log(`[Matchmaking] No bots available for format ${format}`);
        return;
      }

      // Select a random bot
      const randomBot = availableBots[Math.floor(Math.random() * availableBots.length)];
      const botDeck = await randomBot.getDeck(format);

      if (!botDeck) {
        console.log(`[Matchmaking] Bot ${randomBot.name} has no deck for format ${format}`);
        return;
      }

      // Create game settings
      const gameSettings: GameSettings = {
        format: format,
        timeLimit: 1800,
        rules: new Rules(),
        recordingEnabled: true
      };

      // Create game with bot
      const game = this.core.createGameWithDecks(
        player,
        queuedPlayer.deck,
        gameSettings,
        randomBot,
        botDeck
      );

      if (game) {
        console.log(`[Matchmaking] Created game #${game.id} for ${player.name} vs bot ${randomBot.name}`);

        // Notify player
        queuedPlayer.socketWrapper.emit('matchmaking:gameCreated', { gameId: game.id });

        // Remove player from queue
        this.removeFromQueue(player);
      }
    } catch (error) {
      console.error('[Matchmaking] Error matching with bot:', error);
    }
  }

  public dispose(): void {
    try {
      if (this.matchCheckInterval) {
        clearInterval(this.matchCheckInterval);
      }
      if (this.validateInterval) {
        clearInterval(this.validateInterval);
      }
      // Clear all bot match timeouts
      this.botMatchTimeouts.forEach(timeout => clearTimeout(timeout));
      this.botMatchTimeouts.clear();
      // Clear queue on dispose
      this.queue = [];
    } catch (error) {
      console.error('[Matchmaking] Error disposing matchmaking service:', error);
    }
  }
}