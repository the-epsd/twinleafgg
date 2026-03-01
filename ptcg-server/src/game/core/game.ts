import { Action } from '../store/actions/action';
import { Arbiter } from './arbiter';
import { Client } from '../client/client.interface';
import { Core } from './core';
import { GameSettings } from './game-settings';
import { MatchRecorder } from './match-recorder';
import { PlayerStats } from './player-stats';
import { ResolvePromptAction } from '../store/actions/resolve-prompt-action';
import { State, GamePhase } from '../store/state/state';
import { Store } from '../store/store';
import { StoreHandler } from '../store/store-handler';
import { AbortGameAction, AbortGameReason } from '../store/actions/abort-game-action';
import { AddPlayerAction } from '../store/actions/add-player-action';
import { Format } from '../store/card/card-types';
import { CheckHpEffect } from '../store/effects/check-effects';
import { logger } from '../../utils/logger';

export interface DisconnectedPlayer {
  clientId: number;
  disconnectedAt: number;
  wasActivePlayer: boolean;
  timeLeftWhenDisconnected: number;
}

export class Game implements StoreHandler {

  private readonly maxInvalidMoves: number = 100;

  public id: number;
  public clients: Client[] = [];
  public playerStats: PlayerStats[] = [];
  private arbiter = new Arbiter();
  private store: Store;
  private matchRecorder: MatchRecorder;
  private timeoutRef: NodeJS.Timeout | undefined;
  private lastActivity: number = Date.now();
  public format: Format = Format.STANDARD;
  private periodicSyncRef: NodeJS.Timeout | undefined;

  // Reconnection-related properties
  private disconnectedPlayers: Map<number, DisconnectedPlayer> = new Map();
  private disconnectionTimeouts: Map<number, NodeJS.Timeout> = new Map();
  private isPaused: boolean = false;
  private pausedAt: number = 0;
  private userIdToPlayerId: Map<number, number> = new Map();
  private previousPlayerCount: number = 0;

  constructor(private core: Core, id: number, public gameSettings: GameSettings) {
    this.id = id;
    this.store = new Store(this);
    this.store.state.rules = gameSettings.rules;
    this.store.state.gameSettings = gameSettings;
    this.matchRecorder = new MatchRecorder(core);
    this.format = gameSettings.format;
  }

  public get state(): State {
    return this.store.state;
  }

  public getStore(): Store {
    return this.store;
  }

  public updateLastActivity(): void {
    this.lastActivity = Date.now();
  }

  public getLastActivity(): number {
    return this.lastActivity;
  }

  public isInactive(timeoutMs: number = 5 * 60 * 1000): boolean {
    return Date.now() - this.lastActivity > timeoutMs;
  }

  public cleanup(): void {
    this.stopTimer();
    if (this.matchRecorder) {
      this.matchRecorder.cleanup();
    }
    this.store.cleanup();
    this.arbiter.cleanup();

    // Clear all disconnection timeouts
    this.clearAllDisconnectionTimeouts();

    // Clear disconnected players tracking
    this.disconnectedPlayers.clear();
    this.isPaused = false;
    this.userIdToPlayerId.clear();
  }

  public setBonusHps(state: State): void {
    for (const player of state.players) {
      if (player.active.getPokemonCard() !== undefined) {
        const checkHp = new CheckHpEffect(player, player.active);
        this.store.reduceEffect(state, checkHp);
      }
      for (let b = 0; b < player.bench.length; b++) {
        if (player.bench[b].getPokemonCard() !== undefined) {
          const checkHp = new CheckHpEffect(player, player.bench[b]);
          this.store.reduceEffect(state, checkHp);
        }
      }
    }
  }

  public onStateChange(state: State): void {
    this.updateLastActivity();
    if (this.handleArbiterPrompts(state)) {
      return;
    }

    if (this.gameSettings.recordingEnabled) {
      this.matchRecorder.onStateChange(state);
    }

    this.updateIsTimeRunning(state);

    // Check if a player was added to the game
    const playerAdded = state.players.length > this.previousPlayerCount;
    this.previousPlayerCount = state.players.length;

    // Notify clients that are in this game
    this.clients.forEach(c => {
      if (typeof c.onStateChange === 'function') {
        c.onStateChange(this, state);
      }
    });

    // If a player was added, also notify all clients so that other browser windows
    // of the same user can receive the game info update and auto-join
    if (playerAdded) {
      this.core.emit(c => {
        if (typeof c.onStateChange === 'function') {
          c.onStateChange(this, state);
        }
      });
    }

    // Clean up all disconnection timeouts if game is finished
    if (state.phase === GamePhase.FINISHED) {
      this.clearAllDisconnectionTimeouts();
    }

    if (state.phase !== GamePhase.FINISHED && this.timeoutRef === undefined) {
      this.startTimer();
    }

    if (state.phase !== GamePhase.FINISHED && this.periodicSyncRef === undefined) {
      this.startPeriodicSync();
    }

    if (state.phase === GamePhase.FINISHED) {
      this.stopTimer();
      this.stopPeriodicSync();
      this.core.deleteGame(this);
    }
  }

  private handleArbiterPrompts(state: State): boolean {
    let resolved: { id: number, action: ResolvePromptAction } | undefined;
    const unresolved = state.prompts.filter(item => item.result === undefined);

    for (let i = 0; i < unresolved.length; i++) {
      const action = this.arbiter.resolvePrompt(state, unresolved[i]);
      if (action !== undefined) {
        resolved = { id: unresolved[i].id, action };
        break;
      }
    }

    if (resolved === undefined) {
      return false;
    }

    this.store.dispatch(resolved.action);
    return true;
  }

  public dispatch(client: Client, action: Action): State {
    let state = this.store.state;
    try {
      // Pass client roleId for sandbox actions
      const clientRoleId = client.user?.roleId;
      state = this.store.dispatch(action, clientRoleId);
      state = this.updateInvalidMoves(state, client.id, false);

      if (action instanceof AddPlayerAction) {
        this.registerPlayer(client);
      }
    } catch (error) {
      state = this.updateInvalidMoves(state, client.id, true);
      throw error;
    }
    return state;
  }

  public handleClientLeave(client: Client): void {
    const state = this.store.state;
    if (state.phase === GamePhase.FINISHED) {
      return;
    }

    const player = state.players.find(p => p.id === client.id);
    if (player !== undefined) {
      // Instead of immediately aborting, handle as disconnection for reconnection system
      this.handlePlayerDisconnection(client);
    }
  }

  public registerPlayer(client: Client): void {
    if (!client.user) {
      return;
    }

    const player = this.state.players.find(p => p.id === client.id);
    if (!player) {
      return;
    }

    this.userIdToPlayerId.set(client.user.id, player.id);
  }

  public getPlayerIdForUser(userId: number): number | undefined {
    return this.userIdToPlayerId.get(userId);
  }

  /** Returns user ids of all players in this game (for GameInfo.playerUserIds). */
  public getPlayerUserIds(): number[] {
    return Array.from(this.userIdToPlayerId.keys());
  }

  /**
   * Handle player disconnection - preserve state and notify other players
   */
  public handlePlayerDisconnection(client: Client): void {
    const state = this.store.state;

    if (state.phase === GamePhase.FINISHED) {
      return;
    }

    const player = state.players.find(p => p.id === client.id);
    if (!player) {
      return;
    }

    const playerStats = this.playerStats.find(p => p.clientId === client.id);
    const wasActivePlayer = state.activePlayer !== undefined && state.players[state.activePlayer]?.id === client.id;

    // Store disconnection info
    const disconnectedPlayer: DisconnectedPlayer = {
      clientId: client.id,
      disconnectedAt: Date.now(),
      wasActivePlayer,
      timeLeftWhenDisconnected: playerStats?.timeLeft || 0
    };

    this.disconnectedPlayers.set(client.id, disconnectedPlayer);

    // Remove client from active clients list but keep in playerStats
    this.clients = this.clients.filter(c => c.id !== client.id);

    // Pause game if the disconnected player was the active player
    if (wasActivePlayer && !this.isPaused) {
      this.pauseGame();
    }

    // Clear any existing timeout for this client before creating a new one
    // This prevents memory leaks if handlePlayerDisconnection is called multiple times
    const existingTimeout = this.disconnectionTimeouts.get(client.id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Schedule auto-forfeit timer (configurable, default 60s)
    const disconnectForfeitMs = this.core.getReconnectionManager().getCurrentConfig().disconnectForfeitMs ?? 60 * 1000;
    const timeout = setTimeout(() => {
      if (this.disconnectedPlayers.has(client.id) && this.state.phase !== GamePhase.FINISHED) {
        this.handleReconnectionTimeout(client.id);
      }
      this.disconnectionTimeouts.delete(client.id);
    }, disconnectForfeitMs);

    this.disconnectionTimeouts.set(client.id, timeout);

    // Notify other players of disconnection
    this.notifyPlayersOfDisconnection(client);

    logger.log(`Player disconnected from game: gameId=${this.id}, playerId=${client.id}, playerName=${client.name}, wasActivePlayer=${wasActivePlayer}, gamePhase=${state.phase}`);
  }

  /**
   * Handle player reconnection - restore state and resume game
   */
  public handlePlayerReconnection(client: Client): boolean {
    const disconnectedPlayer = this.disconnectedPlayers.get(client.id);

    if (!disconnectedPlayer) {
      logger.log(`Attempted reconnection for player not in disconnected list: gameId=${this.id}, playerId=${client.id}`);
      return false;
    }

    const state = this.store.state;

    if (state.phase === GamePhase.FINISHED) {
      // Game ended while player was disconnected
      this.disconnectedPlayers.delete(client.id);
      // Clean up timeout if it exists
      const timeout = this.disconnectionTimeouts.get(client.id);
      if (timeout) {
        clearTimeout(timeout);
        this.disconnectionTimeouts.delete(client.id);
      }
      return false;
    }

    // Cancel auto-forfeit timeout if player reconnects before 15 seconds
    const timeout = this.disconnectionTimeouts.get(client.id);
    if (timeout) {
      clearTimeout(timeout);
      this.disconnectionTimeouts.delete(client.id);
    }

    // Add client back to active clients
    this.clients.push(client);

    // Restore player's time (accounting for time passed while disconnected)
    const playerStats = this.playerStats.find(p => p.clientId === client.id);
    if (playerStats) {
      // If game was paused, restore original time; otherwise account for time passed
      if (this.isPaused) {
        playerStats.timeLeft = disconnectedPlayer.timeLeftWhenDisconnected;
      } else {
        const timePassed = Math.floor((Date.now() - disconnectedPlayer.disconnectedAt) / 1000);
        playerStats.timeLeft = Math.max(0, disconnectedPlayer.timeLeftWhenDisconnected - timePassed);
      }
    }

    // Resume game if it was paused due to this player's disconnection
    if (this.isPaused && disconnectedPlayer.wasActivePlayer) {
      this.resumeGame();
    }

    // Remove from disconnected players
    this.disconnectedPlayers.delete(client.id);

    // Synchronize client with current game state
    this.synchronizeReconnectedPlayer(client);

    // Notify other players of reconnection
    this.notifyPlayersOfReconnection(client);

    const disconnectionDuration = Date.now() - disconnectedPlayer.disconnectedAt;
    logger.log(`Player reconnected to game: gameId=${this.id}, playerId=${client.id}, playerName=${client.name}, disconnectionDuration=${disconnectionDuration}, gamePhase=${state.phase}`);

    return true;
  }

  /**
   * Synchronize reconnected player with current game state
   */
  private synchronizeReconnectedPlayer(client: Client): void {
    // Send current state to reconnected client
    if (typeof client.onStateChange === 'function') {
      client.onStateChange(this, this.store.state);
    }

    // Send current timer state
    if (typeof client.onTimerUpdate === 'function') {
      client.onTimerUpdate(this, this.playerStats);
    }
  }

  /**
   * Pause the game due to player disconnection
   */
  private pauseGame(): void {
    if (this.isPaused) {
      return;
    }

    this.isPaused = true;
    this.pausedAt = Date.now();

    // Stop timer while paused
    this.stopTimer();

    logger.log(`Game paused due to player disconnection: gameId=${this.id}, gamePhase=${this.store.state.phase}`);
  }

  /**
   * Resume the game after player reconnection
   */
  private resumeGame(): void {
    if (!this.isPaused) {
      return;
    }

    this.isPaused = false;
    const pauseDuration = Date.now() - this.pausedAt;

    // Restart timer
    if (this.store.state.phase !== GamePhase.FINISHED) {
      this.startTimer();
    }

    logger.log(`Game resumed after player reconnection: gameId=${this.id}, pauseDuration=${pauseDuration}, gamePhase=${this.store.state.phase}`);
  }

  /**
   * Notify other players of a disconnection
   */
  private notifyPlayersOfDisconnection(disconnectedClient: Client): void {
    this.clients.forEach(client => {
      if (client.id !== disconnectedClient.id && typeof client.onPlayerDisconnected === 'function') {
        client.onPlayerDisconnected(this, disconnectedClient);
      }
    });

    // Also send connection status update to all players
    this.notifyConnectionStatusUpdate();
  }

  /**
   * Notify other players of a reconnection
   */
  private notifyPlayersOfReconnection(reconnectedClient: Client): void {
    this.clients.forEach(client => {
      if (client.id !== reconnectedClient.id && typeof client.onPlayerReconnected === 'function') {
        client.onPlayerReconnected(this, reconnectedClient);
      }
    });

    // Also send connection status update to all players
    this.notifyConnectionStatusUpdate();
  }

  /**
   * Check if a player is currently disconnected
   */
  public isPlayerDisconnected(clientId: number): boolean {
    return this.disconnectedPlayers.has(clientId);
  }

  /**
   * Get disconnected player info
   */
  public getDisconnectedPlayerInfo(clientId: number): DisconnectedPlayer | undefined {
    return this.disconnectedPlayers.get(clientId);
  }

  /**
   * Get all disconnected players
   */
  public getDisconnectedPlayers(): DisconnectedPlayer[] {
    return Array.from(this.disconnectedPlayers.values());
  }

  /**
   * Check if game is paused due to disconnections
   */
  public isPausedForDisconnection(): boolean {
    return this.isPaused;
  }

  /**
   * Force abort game for players who exceed reconnection timeout
   */
  public handleReconnectionTimeout(clientId: number): void {
    const disconnectedPlayer = this.disconnectedPlayers.get(clientId);

    if (!disconnectedPlayer) {
      return;
    }

    const playerStats = this.playerStats.find(p => p.clientId === clientId);
    const playerName = playerStats ? this.state.players.find(p => p.id === clientId)?.name || 'Unknown' : 'Unknown';

    // Notify other players about the timeout
    this.notifyPlayersOfReconnectionTimeout(clientId, playerName);

    // Remove from disconnected players
    this.disconnectedPlayers.delete(clientId);

    // Remove timeout reference (should already be cleaned up, but ensure it's gone)
    const timeout = this.disconnectionTimeouts.get(clientId);
    if (timeout) {
      clearTimeout(timeout);
      this.disconnectionTimeouts.delete(clientId);
    }

    // Resume game if it was paused for this player
    if (this.isPaused && disconnectedPlayer.wasActivePlayer) {
      this.resumeGame();
    }

    // Abort game for the disconnected player
    const action = new AbortGameAction(clientId, AbortGameReason.DISCONNECTED);
    this.store.dispatch(action);

    logger.log(`Player reconnection timeout - game aborted: gameId=${this.id}, playerId=${clientId}, disconnectionDuration=${Date.now() - disconnectedPlayer.disconnectedAt}`);
  }

  /**
   * Clear all disconnection timeouts
   */
  private clearAllDisconnectionTimeouts(): void {
    for (const timeout of this.disconnectionTimeouts.values()) {
      clearTimeout(timeout);
    }
    this.disconnectionTimeouts.clear();
  }

  /**
   * Get connection status for all players in the game
   */
  public getConnectionStatuses(): Array<{ playerId: number, playerName: string, isConnected: boolean, disconnectedAt?: number }> {
    const statuses: Array<{ playerId: number, playerName: string, isConnected: boolean, disconnectedAt?: number }> = [];

    this.state.players.forEach(player => {
      const isConnected = this.clients.some(c => c.id === player.id);
      const disconnectedPlayer = this.disconnectedPlayers.get(player.id);

      statuses.push({
        playerId: player.id,
        playerName: player.name,
        isConnected,
        disconnectedAt: disconnectedPlayer?.disconnectedAt
      });
    });

    return statuses;
  }

  /**
   * Notify players about connection status updates
   */
  public notifyConnectionStatusUpdate(): void {
    const connectionStatuses = this.getConnectionStatuses();

    this.clients.forEach(client => {
      if (typeof (client as any).onConnectionStatusUpdate === 'function') {
        (client as any).onConnectionStatusUpdate(this, connectionStatuses);
      }
    });
  }

  /**
   * Notify players about reconnection timeout
   */
  private notifyPlayersOfReconnectionTimeout(playerId: number, playerName: string): void {
    this.clients.forEach(client => {
      if (typeof (client as any).onReconnectionTimeout === 'function') {
        (client as any).onReconnectionTimeout(this, playerId, playerName);
      }
    });
  }

  /**
   * Send timeout warning to disconnected player (if they reconnect)
   */
  public sendTimeoutWarning(clientId: number, timeRemaining: number): void {
    const client = this.clients.find(c => c.id === clientId);
    if (client && typeof (client as any).onTimeoutWarning === 'function') {
      (client as any).onTimeoutWarning(this, timeRemaining);
    }
  }

  private updateInvalidMoves(state: State, playerId: number, isInvalidMove: boolean): State {
    if (state.phase === GamePhase.FINISHED) {
      return state;
    }

    // Action dispatched not by the player
    const isPlayer = state.players.some(p => p.id === playerId);
    if (isPlayer === false) {
      return state;
    }

    const stats = this.playerStats.find(p => p.clientId === playerId);
    if (stats === undefined) {
      return state;
    }
    stats.invalidMoves = isInvalidMove ? stats.invalidMoves + 1 : 0;

    if (stats.invalidMoves > this.maxInvalidMoves) {
      const action = new AbortGameAction(playerId, AbortGameReason.ILLEGAL_MOVES);
      state = this.store.dispatch(action);
    }

    return state;
  }

  private updateIsTimeRunning(state: State) {
    state.players.forEach(player => {
      const stats = this.playerStats.find(p => p.clientId === player.id);
      if (stats === undefined) {
        this.playerStats.push({
          clientId: player.id,
          isTimeRunning: false,
          invalidMoves: 0,
          timeLeft: this.gameSettings.timeLimit
        });
      }
    });

    const activePlayers = this.getTimeRunningPlayers(state);
    this.playerStats.forEach(p => {
      p.isTimeRunning = activePlayers.includes(p.clientId);
    });
  }

  /**
   * Returns playerIds that needs to make a move.
   * Used to calculate their time left.
   */
  private getTimeRunningPlayers(state: State): number[] {
    if (state.phase === GamePhase.WAITING_FOR_PLAYERS) {
      return [];
    }

    const result: number[] = [];
    state.prompts.filter(p => p.result === undefined).forEach(p => {
      if (!result.includes(p.playerId)) {
        result.push(p.playerId);
      }
    });

    if (result.length > 0) {
      return result;
    }

    const player = state.players[state.activePlayer];
    if (player !== undefined) {
      result.push(player.id);
    }

    return result;
  }

  private startTimer() {
    const intervalDelay = 1000; // 1 second

    // Game time is set to unlimited
    if (this.gameSettings.timeLimit === 0) {
      return;
    }

    // Don't start timer if game is paused
    if (this.isPaused) {
      return;
    }

    this.timeoutRef = setInterval(() => {
      // Don't decrement time if game is paused
      if (this.isPaused) {
        return;
      }

      for (const stats of this.playerStats) {
        // Only decrement time for connected players who are actively playing
        const isDisconnected = this.isPlayerDisconnected(stats.clientId);

        if (stats.isTimeRunning && !isDisconnected) {
          stats.timeLeft -= 1;
          if (stats.timeLeft <= 0) {
            const action = new AbortGameAction(stats.clientId, AbortGameReason.TIME_ELAPSED);
            this.store.dispatch(action);
            return;
          }
        }
      }

      // Emit timer update to all connected clients
      this.clients.forEach(client => {
        if (typeof client.onTimerUpdate === 'function') {
          client.onTimerUpdate(this, this.playerStats);
        }
      });
    }, intervalDelay);
  }

  private stopTimer() {
    if (this.timeoutRef !== undefined) {
      clearInterval(this.timeoutRef);
      this.timeoutRef = undefined;
    }
  }

  private startPeriodicSync() {
    this.periodicSyncRef = setInterval(() => {
      // Only notify clients that are actually in this game
      this.clients.forEach(c => {
        if (typeof c.onStateChange === 'function') {
          c.onStateChange(this, this.state);
        }
      });
    }, 5000);
  }

  private stopPeriodicSync() {
    if (this.periodicSyncRef !== undefined) {
      clearInterval(this.periodicSyncRef);
      this.periodicSyncRef = undefined;
    }
  }
}