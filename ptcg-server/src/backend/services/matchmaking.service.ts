import { EventEmitter } from 'events';
import { Core } from '../../game/core/core';
import { Format, GameSettings, InvitePlayerAction } from '../../game';

export class MatchmakingService {
  private lobbies: Map<string, string[]> = new Map();
  private playerFormat: Map<string, string> = new Map();
  public queueUpdates: EventEmitter = new EventEmitter();
  private lobbyCache: Map<string, string[]> = new Map();
  private core: Core;

  constructor(core: Core) {
    this.core = core;
  }

  getLobby(format: string): string[] {
    if (!this.lobbyCache.has(format)) {
      this.lobbyCache.set(format, this.lobbies.get(format) || []);
    }
    return this.lobbyCache.get(format) || [];
  }

  async addToQueue(userId: string, format: string): Promise<void> {
    if (!this.lobbies.has(format)) {
      this.lobbies.set(format, []);
    }
    this.lobbies.get(format)?.push(userId);
    this.playerFormat.set(userId, format);
    await this.emitLobbyUpdate(format);
    await this.checkForMatch(format);
  }

  removeFromQueue(userId: string) {
    const format = this.playerFormat.get(userId);
    if (format) {
      const lobby = this.lobbies.get(format);
      if (lobby) {
        const index = lobby.indexOf(userId);
        if (index > -1) {
          lobby.splice(index, 1);
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
        console.log(`Attempting to create match for ${player1} and ${player2}`);
        this.createMatch(player1, player2, format);
      }
    } else {
      console.log(`Not enough players in lobby for ${format}`);
    }
    this.emitLobbyUpdate(format);
  }

  private emitLobbyUpdate(format: string) {
    const lobby = this.lobbies.get(format) || [];
    this.queueUpdates.emit('lobbyUpdate', { format, players: lobby });
  }

  private createMatch(player1: string, player2: string, format: string) {
    const player1Client = this.core.clients.find(client => client.id.toString() === player1);
    const player2Client = this.core.clients.find(client => client.id.toString() === player2);

    if (player1Client && player2Client) {
      const gameSettings = new GameSettings();
      gameSettings.format = format as unknown as Format;
      const game = this.core.createGame(player1Client, [], gameSettings, player2Client);

      // Use InvitePlayerAction to add the second player
      game.dispatch(player1Client, new InvitePlayerAction(player2Client.id, player2Client.name));

      this.queueUpdates.emit('gameStarted', { format, gameId: game.id, players: [player1, player2] });
    } else {
      console.error('Error creating match: Player not found');
      this.addToQueue(player1, format);
      this.addToQueue(player2, format);
    }
  }
}
