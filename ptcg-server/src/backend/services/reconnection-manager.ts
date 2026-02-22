import { DisconnectedSession } from '../../storage/model/disconnected-session';
import { User } from '../../storage/model/user';
import { State, GamePhase } from '../../game/store/state/state';
import { logger, LogLevel } from '../../utils/logger';
import { GameError } from '../../game/game-error';
import { GameCoreError } from '../../game/game-message';
import { GameStatePreserver } from './game-state-preserver';
import { SocketClient } from '../socket/socket-client';
import { Socket } from 'socket.io';
import {
  ReconnectionConfig,
  ReconnectionResult,
  ReconnectionStatus
} from '../interfaces/reconnection.interface';
import { ReconnectionConfigManager, ConfigUpdateEvent, ResourceMetrics } from './reconnection-config-manager';
import { ReconnectionCleanupService } from './reconnection-cleanup.service';
import { ReconnectionMaintenanceScheduler } from './reconnection-maintenance-scheduler';
import { ReconnectionConflictResolver, ConflictResolutionResult } from './reconnection-conflict-resolver';
import { ReconnectionErrorRecovery } from './reconnection-error-recovery';

export class ReconnectionManager {
  private configManager: ReconnectionConfigManager;
  private gameStatePreserver: GameStatePreserver;
  private cleanupService: ReconnectionCleanupService;
  private maintenanceScheduler: ReconnectionMaintenanceScheduler;
  private conflictResolver: ReconnectionConflictResolver;
  private errorRecovery: ReconnectionErrorRecovery;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private resourceMetricsInterval: NodeJS.Timeout | null = null;

  constructor(config: ReconnectionConfig) {
    this.configManager = new ReconnectionConfigManager(config);
    this.gameStatePreserver = new GameStatePreserver({
      preservationTimeoutMs: config.preservationTimeoutMs,
      maxPreservedSessionsPerUser: config.maxPreservedSessionsPerUser,
      maxSerializedStateSize: 1024 * 1024, // 1MB
      compressionEnabled: true
    });

    // Initialize cleanup service
    this.cleanupService = new ReconnectionCleanupService(
      this.gameStatePreserver,
      this.configManager,
      {
        cleanupIntervalMs: config.cleanupIntervalMs,
        databaseOptimizationIntervalMs: 30 * 60 * 1000, // 30 minutes - more frequent
        memoryCleanupThresholdMb: 700, // 700MB - reduce CPU from frequent GC
        maxSessionAge: 6 * 60 * 60 * 1000, // 6 hours - shorter retention
        enableScheduledCleanup: true,
        enableDatabaseOptimization: true,
        enableMemoryManagement: true
      }
    );

    // Initialize maintenance scheduler
    this.maintenanceScheduler = new ReconnectionMaintenanceScheduler(this.cleanupService);
    this.maintenanceScheduler.start();

    // Initialize conflict resolution and error recovery
    this.conflictResolver = new ReconnectionConflictResolver();
    this.errorRecovery = new ReconnectionErrorRecovery();

    // Listen for configuration changes
    this.configManager.on('configUpdated', this.handleConfigUpdate.bind(this));

    // Start cleanup interval (legacy - now handled by cleanup service)
    this.startCleanupInterval();

    // Start resource metrics collection
    this.startResourceMetricsCollection();
  }

  /**
   * Get current configuration
   */
  public getCurrentConfig(): ReconnectionConfig {
    return this.configManager.getCurrentConfig();
  }

  /**
   * Update configuration at runtime
   */
  public updateConfig(partialConfig: Partial<ReconnectionConfig>): boolean {
    const result = this.configManager.updateConfig(partialConfig);
    return result.isValid;
  }

  /**
   * Get configuration manager for advanced operations
   */
  public getConfigManager(): ReconnectionConfigManager {
    return this.configManager;
  }

  /**
   * Handle player disconnection
   */
  public async handleDisconnection(client: SocketClient, reason: string): Promise<void> {
    const startTime = Date.now();
    const user = client.user;
    const sessionId = `${user.id}-${Date.now()}`;

    try {
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'reconnection',
        message: 'Handling disconnection',
        userId: user.id,
        sessionId,
        data: {
          reason,
          gameCount: client.games.length,
          games: client.games.map(g => ({ id: g.id, phase: g.state.phase.toString() }))
        }
      });

      const activeGame = client.games.find(game => game.state.phase !== GamePhase.FINISHED);

      if (!activeGame) {
        logger.logStructured({
          level: LogLevel.INFO,
          category: 'reconnection',
          message: 'User disconnected but has no active game',
          userId: user.id,
          sessionId,
          data: { reason }
        });
        return;
      }

      // Log the disconnection event
      logger.logDisconnection(user.id, activeGame.id, reason, sessionId);

      // Get current game state
      const gameState = activeGame.state;

      // Preserve the game state
      await this.gameStatePreserver.preserveGameState(activeGame.id, user.id, gameState);

      // Create or update disconnected session record
      await this.createDisconnectedSession(user.id, activeGame.id, gameState, reason);

      logger.logStructured({
        level: LogLevel.INFO,
        category: 'reconnection',
        message: 'Disconnected session created',
        userId: user.id,
        gameId: activeGame.id,
        sessionId,
        data: { reason }
      });

      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'reconnection',
        message: 'Disconnection handled successfully',
        userId: user.id,
        gameId: activeGame.id,
        sessionId,
        data: {
          reason,
          processingTimeMs: duration,
          gamePhase: gameState.phase.toString()
        }
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'reconnection',
        message: 'Error handling disconnection',
        userId: user.id,
        sessionId,
        data: {
          reason,
          processingTimeMs: duration
        },
        error: error as Error
      });

      throw new GameError(GameCoreError.ERROR_SERIALIZER,
        `Failed to handle disconnection for user ${client.user.id}: ${error}`);
    }
  }

  /**
   * Handle player reconnection attempt
   */
  public async handleReconnection(user: User, socket: Socket): Promise<ReconnectionResult> {
    const startTime = Date.now();
    const sessionId = `${user.id}-reconnect-${Date.now()}`;

    try {
      logger.logReconnectionAttempt(user.id, 0, 1, sessionId);

      // Find active disconnected session for this user
      const disconnectedSession = await this.findActiveDisconnectedSession(user.id);

      if (!disconnectedSession) {
        logger.logReconnectionFailure(user.id, 0, 'No active disconnected session found', sessionId);
        return {
          success: false,
          error: 'No active disconnected session found'
        };
      }

      // Check if session has expired
      if (Date.now() > disconnectedSession.expiresAt) {
        logger.logSessionExpiry(user.id, disconnectedSession.gameId, sessionId);
        await disconnectedSession.remove();
        logger.logReconnectionFailure(user.id, disconnectedSession.gameId, 'Reconnection session has expired', sessionId);
        return {
          success: false,
          error: 'Reconnection session has expired'
        };
      }

      // Retrieve preserved game state with error recovery
      let preservedState;
      try {
        preservedState = await this.gameStatePreserver.getPreservedState(
          disconnectedSession.gameId,
          user.id
        );
      } catch (error) {
        logger.logStructured({
          level: LogLevel.WARN,
          category: 'reconnection',
          message: 'Error retrieving preserved state, attempting recovery',
          userId: user.id,
          gameId: disconnectedSession.gameId,
          sessionId,
          error: error as Error
        });

        // Attempt error recovery
        const recoveryResult = await this.errorRecovery.recoverFromError(
          error as Error,
          disconnectedSession.gameId,
          user.id,
          undefined, // No preserved state available
          undefined, // No server state available at this point
          1,
          3
        );

        if (!recoveryResult.success) {
          await disconnectedSession.remove();
          logger.logReconnectionFailure(user.id, disconnectedSession.gameId,
            `State recovery failed: ${recoveryResult.error}`, sessionId);
          return {
            success: false,
            error: recoveryResult.error || 'Game state could not be recovered'
          };
        }

        // Use recovered state if available
        if (recoveryResult.recoveredState) {
          preservedState = {
            gameId: disconnectedSession.gameId,
            userId: user.id,
            state: recoveryResult.recoveredState,
            preservedAt: disconnectedSession.disconnectedAt,
            lastActivity: disconnectedSession.disconnectedAt
          };
        }
      }

      if (!preservedState) {
        logger.logStateRestoration(user.id, disconnectedSession.gameId, false, sessionId,
          new Error('No preserved state found'));
        await disconnectedSession.remove();
        logger.logReconnectionFailure(user.id, disconnectedSession.gameId, 'Game state could not be restored', sessionId);
        return {
          success: false,
          error: 'Game state could not be restored'
        };
      }

      // Validate reconnection preconditions
      const preconditionValidation = this.errorRecovery.validateReconnectionPreconditions(
        disconnectedSession.gameId,
        user.id,
        preservedState.state
      );

      if (!preconditionValidation.isValid && !preconditionValidation.canRecover) {
        logger.logStructured({
          level: LogLevel.ERROR,
          category: 'reconnection',
          message: 'Reconnection preconditions failed',
          userId: user.id,
          gameId: disconnectedSession.gameId,
          sessionId,
          data: {
            errors: preconditionValidation.errors,
            warnings: preconditionValidation.warnings
          }
        });

        await disconnectedSession.remove();
        await this.gameStatePreserver.removePreservedState(disconnectedSession.gameId, user.id);

        return {
          success: false,
          error: `Reconnection preconditions failed: ${preconditionValidation.errors.join(', ')}`
        };
      }

      // Validate the preserved state
      const stateValidation = this.conflictResolver.validateState(
        preservedState.state,
        disconnectedSession.gameId,
        user.id
      );

      if (!stateValidation.isValid && !stateValidation.canRecover) {
        logger.logStructured({
          level: LogLevel.ERROR,
          category: 'reconnection',
          message: 'Preserved state validation failed',
          userId: user.id,
          gameId: disconnectedSession.gameId,
          sessionId,
          data: {
            errors: stateValidation.errors,
            warnings: stateValidation.warnings
          }
        });

        // Attempt error recovery for invalid state
        const gameError = new GameError(GameCoreError.ERROR_SERIALIZER, `Invalid state: ${stateValidation.errors.join(', ')}`);
        const error = new Error(gameError.message);
        const recoveryResult = await this.errorRecovery.recoverFromError(
          error,
          disconnectedSession.gameId,
          user.id,
          preservedState.state,
          undefined,
          1,
          3
        );

        if (!recoveryResult.success) {
          await disconnectedSession.remove();
          await this.gameStatePreserver.removePreservedState(disconnectedSession.gameId, user.id);

          return {
            success: false,
            error: recoveryResult.error || 'State validation failed and could not be recovered'
          };
        }

        // Use recovered state
        if (recoveryResult.recoveredState) {
          preservedState.state = recoveryResult.recoveredState;
        }
      }

      // Clean up the disconnected session
      await disconnectedSession.remove();
      await this.gameStatePreserver.removePreservedState(disconnectedSession.gameId, user.id);

      const reconnectionTime = Date.now() - disconnectedSession.disconnectedAt;
      logger.logReconnectionSuccess(user.id, disconnectedSession.gameId, reconnectionTime, sessionId);
      logger.logStateRestoration(user.id, disconnectedSession.gameId, true, sessionId);

      return {
        success: true,
        gameId: disconnectedSession.gameId,
        gameState: preservedState.state
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'reconnection',
        message: 'Error handling reconnection',
        userId: user.id,
        sessionId,
        data: {
          processingTimeMs: duration
        },
        error: error as Error
      });

      // Attempt final error recovery
      try {
        const recoveryResult = await this.errorRecovery.recoverFromError(
          error as Error,
          0, // Unknown game ID
          user.id,
          undefined,
          undefined,
          1,
          1 // Only one attempt for final recovery
        );

        if (recoveryResult.success) {
          return {
            success: true,
            gameId: 0, // Will need to be handled by caller
            gameState: recoveryResult.recoveredState
          };
        }
      } catch (recoveryError) {
        logger.logStructured({
          level: LogLevel.ERROR,
          category: 'reconnection',
          message: 'Final error recovery failed',
          userId: user.id,
          sessionId,
          error: recoveryError as Error
        });
      }

      return {
        success: false,
        error: `Reconnection failed: ${error}`
      };
    }
  }

  /**
   * Get reconnection status for a user
   */
  public async getReconnectionStatus(userId: number): Promise<ReconnectionStatus | null> {
    try {
      const disconnectedSession = await this.findActiveDisconnectedSession(userId);

      if (!disconnectedSession) {
        return null;
      }

      // Check if session has expired
      if (Date.now() > disconnectedSession.expiresAt) {
        await disconnectedSession.remove();
        return null;
      }

      return {
        userId: disconnectedSession.userId,
        gameId: disconnectedSession.gameId,
        disconnectedAt: disconnectedSession.disconnectedAt,
        expiresAt: disconnectedSession.expiresAt,
        gamePhase: disconnectedSession.gamePhase,
        isPlayerTurn: disconnectedSession.isPlayerTurn
      };

    } catch (error) {
      logger.log(`[ReconnectionManager] Error getting reconnection status: ${error}`);
      return null;
    }
  }

  /**
   * Clean up expired disconnected sessions (delegated to cleanup service)
   */
  public async cleanupExpiredSessions(): Promise<void> {
    await this.cleanupService.performScheduledCleanup();
  }

  /**
   * Get all disconnected sessions for monitoring
   */
  public async getActiveDisconnectedSessions(): Promise<DisconnectedSession[]> {
    try {
      const now = Date.now();
      return await DisconnectedSession.createQueryBuilder('session')
        .where('session.expiresAt > :now', { now })
        .getMany();
    } catch (error) {
      logger.log(`[ReconnectionManager] Error getting active sessions: ${error}`);
      return [];
    }
  }

  /**
   * Force cleanup of all sessions for a specific user (delegated to cleanup service)
   */
  public async cleanupUserSessions(userId: number): Promise<void> {
    await this.cleanupService.forceCleanupUserSessions(userId);
  }



  /**
   * Create or update disconnected session record
   */
  private async createDisconnectedSession(
    userId: number,
    gameId: number,
    gameState: State,
    reason: string
  ): Promise<void> {
    const now = Date.now();
    const expiresAt = now + this.getCurrentConfig().preservationTimeoutMs;

    try {
      // Check for existing session
      const existingSession = await DisconnectedSession.findOne({
        where: { userId, gameId }
      });

      if (existingSession) {
        logger.logStructured({
          level: LogLevel.INFO,
          category: 'reconnection',
          message: 'Updating existing disconnected session',
          userId,
          gameId,
          data: { sessionId: existingSession.id, reason }
        });

        existingSession.disconnectedAt = now;
        existingSession.expiresAt = expiresAt;
        existingSession.gamePhase = gameState.phase.toString();
        existingSession.isPlayerTurn = this.isPlayerTurn(gameState, userId);
        existingSession.disconnectionReason = reason;
        await existingSession.save();
      } else {
        logger.logStructured({
          level: LogLevel.INFO,
          category: 'reconnection',
          message: 'Creating new disconnected session',
          userId,
          gameId,
          data: { reason, expiresAt }
        });

        const session = new DisconnectedSession();
        session.userId = userId;
        session.gameId = gameId;
        session.gameState = ''; // This will be handled by GameStatePreserver
        session.disconnectedAt = now;
        session.expiresAt = expiresAt;
        session.gamePhase = gameState.phase.toString();
        session.isPlayerTurn = this.isPlayerTurn(gameState, userId);
        session.disconnectionReason = reason;
        await session.save();

        logger.logStructured({
          level: LogLevel.INFO,
          category: 'reconnection',
          message: 'Disconnected session saved',
          userId,
          gameId,
          data: { sessionId: session.id, reason }
        });
      }
    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'reconnection',
        message: 'Error creating disconnected session',
        userId,
        gameId,
        error: error as Error
      });
      throw error;
    }
  }

  /**
   * Find active disconnected session for a user
   */
  private async findActiveDisconnectedSession(userId: number): Promise<DisconnectedSession | null> {
    const now = Date.now();
    const result = await DisconnectedSession.createQueryBuilder('session')
      .where('session.userId = :userId', { userId })
      .andWhere('session.expiresAt > :now', { now })
      .orderBy('session.disconnectedAt', 'DESC')
      .getOne();
    return result || null;
  }

  /**
   * Check if it's the player's turn
   */
  private isPlayerTurn(gameState: State, userId: number): boolean {
    // This is a simplified implementation
    // In reality, you'd need to map the userId to the player index
    // based on the game's player mapping
    return gameState.activePlayer === 0; // Placeholder
  }

  /**
   * Check for sessions approaching timeout and send warnings
   */
  public async checkTimeoutWarnings(): Promise<void> {
    try {
      const now = Date.now();
      const warningThreshold = 60000; // 1 minute before timeout

      const approachingTimeoutSessions = await DisconnectedSession.createQueryBuilder('session')
        .where('session.expiresAt > :now', { now })
        .andWhere('session.expiresAt <= :warningTime', { warningTime: now + warningThreshold })
        .getMany();

      for (const session of approachingTimeoutSessions) {
        const timeRemaining = Math.max(0, session.expiresAt - now);

        // Find the game and send warning to the disconnected player if they reconnect
        // This would be handled by the Core when the player reconnects
        logger.log(`[ReconnectionManager] Session approaching timeout: userId=${session.userId} gameId=${session.gameId} timeRemaining=${timeRemaining}ms`);
      }

    } catch (error) {
      logger.log(`[ReconnectionManager] Error checking timeout warnings: ${error}`);
    }
  }

  /**
   * Start the cleanup interval
   */
  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(
      async () => {
        await this.cleanupExpiredSessions();
        await this.checkTimeoutWarnings();
      },
      this.getCurrentConfig().cleanupIntervalMs
    );
    logger.log(`[ReconnectionManager] Started cleanup interval (${this.getCurrentConfig().cleanupIntervalMs}ms)`);
  }

  /**
   * Handle configuration updates
   */
  private handleConfigUpdate(event: ConfigUpdateEvent): void {
    logger.logStructured({
      level: LogLevel.INFO,
      category: 'reconnection',
      message: 'Configuration updated',
      data: {
        source: event.source,
        timestamp: event.timestamp,
        changes: this.getConfigDifferences(event.oldConfig, event.newConfig)
      }
    });

    // Update GameStatePreserver configuration
    this.gameStatePreserver.updateConfig({
      preservationTimeoutMs: event.newConfig.preservationTimeoutMs,
      maxPreservedSessionsPerUser: event.newConfig.maxPreservedSessionsPerUser
    });

    // Restart cleanup interval if the interval changed
    if (event.oldConfig.cleanupIntervalMs !== event.newConfig.cleanupIntervalMs) {
      this.restartCleanupInterval();
    }
  }

  /**
   * Start resource metrics collection
   */
  private startResourceMetricsCollection(): void {
    this.resourceMetricsInterval = setInterval(
      async () => {
        await this.collectAndUpdateResourceMetrics();
      },
      30 * 1000 // Collect metrics every 30 seconds
    );
    logger.log('[ReconnectionManager] Started resource metrics collection');
  }

  /**
   * Collect and update resource metrics
   */
  private async collectAndUpdateResourceMetrics(): Promise<void> {
    try {
      const metrics: Partial<ResourceMetrics> = {
        preservedSessions: await this.getPreservedSessionCount(),
        activeSessions: await this.getActiveSessionCount(),
        // Note: Memory and CPU metrics would typically come from system monitoring
        // For now, we'll use placeholder values or skip them
        timestamp: Date.now()
      };

      this.configManager.updateResourceMetrics(metrics);
    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'reconnection',
        message: 'Error collecting resource metrics',
        data: { error: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  /**
   * Get count of preserved sessions
   */
  private async getPreservedSessionCount(): Promise<number> {
    try {
      return await DisconnectedSession.count();
    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'reconnection',
        message: 'Error getting preserved session count',
        data: { error: error instanceof Error ? error.message : String(error) }
      });
      return 0;
    }
  }

  /**
   * Get count of active sessions (placeholder - would need actual session tracking)
   */
  private async getActiveSessionCount(): Promise<number> {
    // This would typically come from the WebSocket server or session manager
    // For now, return a placeholder value
    return 0;
  }

  /**
   * Restart cleanup interval with new configuration
   */
  private restartCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.startCleanupInterval();
  }

  /**
   * Get differences between two configurations
   */
  private getConfigDifferences(oldConfig: ReconnectionConfig, newConfig: ReconnectionConfig): Record<string, { old: any; new: any }> {
    const differences: Record<string, { old: any; new: any }> = {};

    for (const key of Object.keys(newConfig) as (keyof ReconnectionConfig)[]) {
      if (JSON.stringify(oldConfig[key]) !== JSON.stringify(newConfig[key])) {
        differences[key] = {
          old: oldConfig[key],
          new: newConfig[key]
        };
      }
    }

    return differences;
  }

  /**
   * Get cleanup service for advanced cleanup operations
   */
  public getCleanupService(): ReconnectionCleanupService {
    return this.cleanupService;
  }

  /**
   * Get maintenance scheduler for advanced maintenance operations
   */
  public getMaintenanceScheduler(): ReconnectionMaintenanceScheduler {
    return this.maintenanceScheduler;
  }

  /**
   * Handle state conflicts during reconnection
   */
  public async handleStateConflicts(
    serverState: State,
    preservedState: State,
    gameId: number,
    userId: number
  ): Promise<ConflictResolutionResult> {
    const sessionId = `state-conflict-${userId}-${gameId}-${Date.now()}`;

    try {
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'conflict-resolution',
        message: 'Handling state conflicts',
        userId,
        gameId,
        sessionId,
        data: {
          serverPhase: serverState.phase.toString(),
          preservedPhase: preservedState.phase.toString()
        }
      });

      // Detect conflicts
      const conflicts = this.conflictResolver.detectConflicts(serverState, preservedState, gameId, userId);

      if (conflicts.length === 0) {
        logger.logStructured({
          level: LogLevel.INFO,
          category: 'conflict-resolution',
          message: 'No conflicts detected',
          userId,
          gameId,
          sessionId
        });

        return {
          success: true,
          resolvedState: serverState, // Use server state when no conflicts
          conflicts: [],
          fallbackApplied: false
        };
      }

      // Resolve conflicts
      const resolution = this.conflictResolver.resolveConflicts(
        serverState,
        preservedState,
        conflicts,
        gameId,
        userId
      );

      logger.logStructured({
        level: resolution.success ? LogLevel.INFO : LogLevel.ERROR,
        category: 'conflict-resolution',
        message: 'Conflict resolution completed',
        userId,
        gameId,
        sessionId,
        data: {
          success: resolution.success,
          conflictCount: conflicts.length,
          fallbackApplied: resolution.fallbackApplied
        }
      });

      return resolution;

    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'conflict-resolution',
        message: 'Error handling state conflicts',
        userId,
        gameId,
        sessionId,
        error: error as Error
      });

      // Return server state as fallback
      return {
        success: true,
        resolvedState: serverState,
        conflicts: [{
          type: 'data_corruption',
          description: `Conflict resolution failed: ${error}`,
          serverState: {},
          preservedState: {},
          severity: 'critical',
          resolvable: false
        }],
        fallbackApplied: true
      };
    }
  }

  /**
   * Get conflict resolver for advanced conflict operations
   */
  public getConflictResolver(): ReconnectionConflictResolver {
    return this.conflictResolver;
  }

  /**
   * Get error recovery service for advanced error handling
   */
  public getErrorRecovery(): ReconnectionErrorRecovery {
    return this.errorRecovery;
  }

  /**
   * Dispose of the reconnection manager
   */
  public async dispose(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    if (this.resourceMetricsInterval) {
      clearInterval(this.resourceMetricsInterval);
      this.resourceMetricsInterval = null;
    }

    // Stop maintenance scheduler
    this.maintenanceScheduler.stop();

    // Gracefully shutdown cleanup service
    await this.cleanupService.gracefulShutdown();

    this.configManager.dispose();

    logger.log('[ReconnectionManager] Disposed');
  }
}