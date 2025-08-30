import { AddPlayerAction } from '../store/actions/add-player-action';
import { CleanerTask } from '../tasks/cleaner-task';
import { Client } from '../client/client.interface';
import { GameError } from '../game-error';
import { GameMessage } from '../game-message';
import { Game } from './game';
import { GameSettings } from './game-settings';
import { InvitePlayerAction } from '../store/actions/invite-player-action';
import { Messager } from './messager';
import { RankingCalculator } from './ranking-calculator';
import { Scheduler, generateId } from '../../utils';
import { config } from '../../config';
import { Format } from '../store/card/card-types';
import { AbortGameAction } from '../store/actions/abort-game-action';
import { AbortGameReason } from '../store/actions/abort-game-action';
import { GamePhase } from '../store/state/state';
import { BotManager } from '../bots/bot-manager';
import { ReconnectionManager } from '../../backend/services/reconnection-manager';
import { ReconnectionConfig } from '../../backend/interfaces/reconnection.interface';
import { logger } from '../../utils/logger';
import { User } from '../../storage';

export class Core {
  public clients: Client[] = [];
  public games: Game[] = [];
  public messager: Messager;
  private botManager: BotManager;
  private reconnectionManager: ReconnectionManager;

  constructor(reconnectionConfig?: ReconnectionConfig) {
    this.messager = new Messager(this);
    this.botManager = BotManager.getInstance();

    // Initialize reconnection manager with default config if not provided
    const defaultConfig: ReconnectionConfig = {
      preservationTimeoutMs: 5 * 60 * 1000, // 5 minutes
      maxAutoReconnectAttempts: 3,
      reconnectIntervals: [5000, 10000, 15000],
      healthCheckIntervalMs: 30 * 1000,
      cleanupIntervalMs: 60 * 1000,
      maxPreservedSessionsPerUser: 1
    };
    this.reconnectionManager = new ReconnectionManager(reconnectionConfig || defaultConfig);

    const cleanerTask = new CleanerTask(this);
    cleanerTask.startTasks();
    this.startRankingDecrease();
    this.startInactiveGameCleanup();
  }

  public getBotManager(): BotManager {
    return this.botManager;
  }

  public getReconnectionManager(): ReconnectionManager {
    return this.reconnectionManager;
  }

  public async connect(client: Client): Promise<Client> {
    client.id = generateId(this.clients);
    client.core = this;
    client.games = [];

    // Add client to the core
    this.clients.push(client);

    // Emit connection events to notify other clients
    this.emit(c => c.onConnect(client));

    // Send updated user list to all clients to show the new user as online
    this.broadcastUserUpdates();

    return client;
  }

  public async disconnect(client: Client, reason: string = 'unknown'): Promise<void> {
    const index = this.clients.indexOf(client);
    if (index === -1) {
      throw new GameError(GameMessage.ERROR_CLIENT_NOT_CONNECTED);
    }

    // Leave all games
    client.games.forEach(game => this.leaveGame(client, game));

    // Remove client from core
    this.clients.splice(index, 1);
    client.core = undefined;

    // Notify other clients
    this.emit(c => c.onDisconnect(client));

    // Send updated user list to all clients to show the user as offline
    this.broadcastUserUpdates();
  }

  public createGame(
    client: Client,
    deck: string[],
    gameSettings: GameSettings = new GameSettings(),
    invited?: Client
  ): Game {
    if (this.clients.indexOf(client) === -1) {
      throw new GameError(GameMessage.ERROR_CLIENT_NOT_CONNECTED);
    }
    if (invited && this.clients.indexOf(invited) === -1) {
      throw new GameError(GameMessage.ERROR_CLIENT_NOT_CONNECTED);
    }
    if (gameSettings.format === Format.RETRO) {
      gameSettings.rules.attackFirstTurn = true;
      gameSettings.rules.firstTurnDrawCard = false;
    }
    if (gameSettings.format === Format.RSPK) {
      gameSettings.rules.attackFirstTurn = true;
      gameSettings.rules.firstTurnDrawCard = false;
    }
    if (gameSettings.format === Format.BW) {
      gameSettings.rules.attackFirstTurn = true;
      gameSettings.rules.firstTurnDrawCard = true;
      gameSettings.rules.firstTurnUseSupporter = true;
    }
    const game = new Game(this, generateId(this.games), gameSettings);
    game.dispatch(client, new AddPlayerAction(client.id, client.name, deck));
    if (invited) {
      game.dispatch(client, new InvitePlayerAction(invited.id, invited.name));
    }
    this.games.push(game);
    this.emit(c => c.onGameAdd(game));
    this.joinGame(client, game);
    if (invited) {
      this.joinGame(invited, game);
    }
    return game;
  }

  public createGameWithDecks(
    client: Client,
    deck: string[],
    gameSettings: GameSettings = new GameSettings(),
    client2: Client,
    deck2: string[]
  ): Game {
    if (this.clients.indexOf(client) === -1) {
      throw new GameError(GameMessage.ERROR_CLIENT_NOT_CONNECTED);
    }
    if (this.clients.indexOf(client2) === -1) {
      throw new GameError(GameMessage.ERROR_CLIENT_NOT_CONNECTED);
    }

    console.log(`[Matchmaking] Match created between ${client.name} and ${client2.name} (Format: ${gameSettings.format})`);
    if (gameSettings.format === Format.RETRO) {
      gameSettings.rules.attackFirstTurn = true;
      gameSettings.rules.firstTurnDrawCard = false;
    }
    if (gameSettings.format === Format.RSPK) {
      gameSettings.rules.attackFirstTurn = true;
      gameSettings.rules.firstTurnDrawCard = false;
    }
    if (gameSettings.format === Format.BW) {
      gameSettings.rules.attackFirstTurn = true;
      gameSettings.rules.firstTurnDrawCard = true;
      gameSettings.rules.firstTurnUseSupporter = true;
    }
    const game = new Game(this, generateId(this.games), gameSettings);
    game.dispatch(client, new AddPlayerAction(client.id, client.name, deck));
    game.dispatch(client, new AddPlayerAction(client2.id, client2.name, deck2));
    this.games.push(game);
    this.emit(c => c.onGameAdd(game));
    this.joinGame(client, game);
    this.joinGame(client2, game);
    return game;
  }

  public joinGame(client: Client, game: Game): void {
    if (this.clients.indexOf(client) === -1) {
      throw new GameError(GameMessage.ERROR_CLIENT_NOT_CONNECTED);
    }
    if (this.games.indexOf(game) === -1) {
      throw new GameError(GameMessage.ERROR_GAME_NOT_FOUND);
    }
    if (client.games.indexOf(game) === -1) {
      this.emit(c => c.onGameJoin(game, client));
      client.games.push(game);
      game.clients.push(client);
    }
  }

  public deleteGame(game: Game): void {
    game.clients.forEach(client => {
      const index = client.games.indexOf(game);
      if (index !== -1) {
        client.games.splice(index, 1);
        this.emit(c => c.onGameLeave(game, client));
      }
    });
    const index = this.games.indexOf(game);
    if (index !== -1) {
      this.games.splice(index, 1);
      this.emit(c => c.onGameDelete(game));
    }
  }

  public leaveGame(client: Client, game: Game): void {
    if (this.clients.indexOf(client) === -1) {
      throw new GameError(GameMessage.ERROR_CLIENT_NOT_CONNECTED);
    }
    if (this.games.indexOf(game) === -1) {
      throw new GameError(GameMessage.ERROR_GAME_NOT_FOUND);
    }
    const gameIndex = client.games.indexOf(game);
    const clientIndex = game.clients.indexOf(client);
    if (clientIndex !== -1 && gameIndex !== -1) {
      client.games.splice(gameIndex, 1);
      game.clients.splice(clientIndex, 1);
      this.emit(c => c.onGameLeave(game, client));
      game.handleClientLeave(client);
    }
    if (game.clients.length === 0) {
      this.deleteGame(game);
    }
  }

  public emit(fn: (client: Client) => void): void {
    this.clients.forEach(fn);
  }

  /**
   * Broadcast user updates to all connected clients
   */
  private broadcastUserUpdates(): void {
    // Get all unique users from connected clients
    const userIds = new Set(this.clients.map(c => c.user.id));
    const users = Array.from(userIds).map(userId => {
      const client = this.clients.find(c => c.user.id === userId);
      return client ? client.user : null;
    }).filter((user): user is User => user !== null);

    // Emit user updates to all clients
    this.emit(c => c.onUsersUpdate(users));
  }

  private startRankingDecrease() {
    const scheduler = Scheduler.getInstance();
    const rankingCalculator = new RankingCalculator();
    scheduler.run(async () => {
      let users = await rankingCalculator.decreaseRanking();

      // Notify only about users which are currently connected
      const connectedUserIds = this.clients.map(c => c.user.id);
      users = users.filter(u => connectedUserIds.includes(u.id));

      this.emit(c => c.onUsersUpdate(users));
    }, config.core.rankingDecreaseIntervalCount);
  }

  private startInactiveGameCleanup(): void {
    const scheduler = Scheduler.getInstance();
    // Check for inactive games every 5 minutes
    scheduler.run(async () => {
      const inactiveTimeout = 5 * 60 * 1000; // 5 minutes

      for (const game of this.games) {
        if (game.isInactive(inactiveTimeout)) {
          console.log(`[Game Cleanup] Checking inactive game ${game.id}`);

          // Check if this game has preserved sessions before cleaning up
          try {
            const activeSessions = await this.reconnectionManager.getActiveDisconnectedSessions();
            const gameHasPreservedSessions = activeSessions.some(session => session.gameId === game.id);

            if (gameHasPreservedSessions) {
              console.log(`[Game Cleanup] Skipping cleanup of game ${game.id} - has preserved sessions`);
              continue;
            }
          } catch (error) {
            console.log(`[Game Cleanup] Error checking preserved sessions for game ${game.id}: ${error}`);
            // If we can't check, skip cleanup to be safe
            continue;
          }

          console.log(`[Game Cleanup] Cleaning up inactive game ${game.id}`);
          // Force end the game
          const state = game.state;
          if (state.phase !== GamePhase.FINISHED) {
            state.players.forEach(player => {
              const action = new AbortGameAction(player.id, AbortGameReason.DISCONNECTED);
              // Use the first client as the source for the abort action
              if (game.clients.length > 0) {
                game.dispatch(game.clients[0], action);
              }
            });
          }
          game.cleanup();
          this.deleteGame(game);
        }
      }
    }, 5 * 60); // Run every 5 minutes
  }

  /**
   * Dispose of the Core and cleanup resources
   */
  public dispose(): void {
    if (this.reconnectionManager) {
      this.reconnectionManager.dispose();
    }
    logger.log('[Core] Disposed');
  }

}