import { EventEmitter } from 'events';
import { Format, GameSettings } from '../../game';
import { Core } from '../../game/core/core';

class MatchmakingService {
  private static instance: MatchmakingService;
  private lobbies: Map<string, [number, string[]][]> = new Map();
  private playerFormat: Map<number, string> = new Map();
  public queueUpdates: EventEmitter = new EventEmitter();
  private lobbyCache: Map<string, [number, string[]][]> = new Map();
  private core: Core;
  private lastCleanup: number = 0;
  private readonly CLEANUP_INTERVAL = 60000; // Clean up every minute

  private constructor(core: Core) {
    this.core = core;
    this.startCleanupInterval();
  }

  public static getInstance(core: Core): MatchmakingService {
    if (!MatchmakingService.instance) {
      MatchmakingService.instance = new MatchmakingService(core);
    }
    return MatchmakingService.instance;
  }

  private startCleanupInterval(): void {
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
  }

  private cleanup(): void {
    const now = Date.now();
    if (now - this.lastCleanup < this.CLEANUP_INTERVAL) {
      return;
    }

    // Clean up disconnected players from lobbies
    for (const [format, lobby] of this.lobbies.entries()) {
      const activePlayers = lobby.filter(([userId]) =>
        this.core.clients.some(client => client.id === userId)
      );

      if (activePlayers.length !== lobby.length) {
        this.lobbies.set(format, activePlayers);
        this.emitLobbyUpdate(format);
      }

      if (activePlayers.length === 0) {
        this.lobbies.delete(format);
      }
    }

    // Clean up playerFormat map
    for (const [userId] of this.playerFormat) {
      if (!this.core.clients.some(client => client.id === userId)) {
        this.playerFormat.delete(userId);
      }
    }

    // Clear lobby cache
    this.lobbyCache.clear();

    this.lastCleanup = now;
  }

  getLobby(format: string): [number, string[]][] {
    this.cleanup();
    if (!this.lobbyCache.has(format)) {
      this.lobbyCache.set(format, this.lobbies.get(format) || []);
    }
    return this.lobbyCache.get(format) || [];
  }

  async addToQueue(userId: number, format: string, deck: string[]): Promise<void> {
    this.cleanup();
    if (!this.lobbies.has(format)) {
      this.lobbies.set(format, []);
    }
    this.lobbies.get(format)?.push([userId, deck]);
    this.playerFormat.set(userId, format);
    await this.emitLobbyUpdate(format);
    await this.checkForMatch(format);
  }

  removeFromQueue(userId: number) {
    this.cleanup();
    const format = this.playerFormat.get(userId);
    if (format) {
      const lobby = this.lobbies.get(format);
      if (lobby) {
        const index = lobby.findIndex(l => l[0] === userId);
        if (index > -1) {
          lobby.splice(index, 1);
        }
        if (lobby.length === 0) {
          this.lobbies.delete(format);
        }
      }
      this.playerFormat.delete(userId);
      this.emitLobbyUpdate(format);
    }
  }

  private checkForMatch(format: string) {
    console.log(`Checking for match in format: ${format}`);
    const lobby = this.lobbies.get(format);
    if (lobby && lobby.length >= 2) {
      console.log(`Found ${lobby.length} players in lobby for ${format}`);
      const player1 = lobby.shift();
      const player2 = lobby.shift();
      if (player1 && player2) {
        console.log('Attempting to create match for Player 1 & Player 2');
        this.createMatch(player1, player2, format);
      }
      if (lobby.length === 0) {
        this.lobbies.delete(format);
      }
    } else {
      console.log(`Not enough players in lobby for ${format}`);
    }
    this.emitLobbyUpdate(format);
  }

  private emitLobbyUpdate(format: string) {
    const lobby = this.lobbies.get(format) || [];
    this.queueUpdates.emit('matchmaking:lobbyUpdate', { format, players: lobby });
  }

  private createMatch(player1: [number, string[]], player2: [number, string[]], format: string) {
    const player1Client = this.core.clients.find(client => client.id === player1[0]);
    const player2Client = this.core.clients.find(client => client.id === player2[0]);

    if (player1Client && player2Client) {
      const gameSettings = new GameSettings();
      gameSettings.format = format as unknown as Format;

      if (gameSettings.format.toString() === 'GLC') {
        gameSettings.timeLimit = 1200;
      }
      const game = this.core.createGameWithDecks(player1Client, player1[1], gameSettings, player2Client, player2[1]);

      // // Use InvitePlayerAction to add the second player
      // game.dispatch(player1Client, new InvitePlayerAction(player2Client.id, player2Client.name));
      this.queueUpdates.emit('gameStarted', { format, gameId: game.id, players: [player1, player2] });
    } else {
      console.error('Error creating match: Player not found');
      this.addToQueue(player1[0], format, player1[1]);
      this.addToQueue(player2[0], format, player2[1]);
    }
  }
}

export default MatchmakingService;