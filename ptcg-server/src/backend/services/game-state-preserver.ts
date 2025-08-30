import { DisconnectedSession } from '../../storage/model/disconnected-session';
import { State } from '../../game/store/state/state';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { logger, LogLevel } from '../../utils/logger';
import { GameError } from '../../game/game-error';
import { GameCoreError } from '../../game/game-message';

export interface PreservedGameState {
  gameId: number;
  userId: number;
  state: State;
  preservedAt: number;
  lastActivity: number;
}

export interface GameStatePreserverConfig {
  preservationTimeoutMs: number;
  maxPreservedSessionsPerUser: number;
}

export class GameStatePreserver {
  private config: GameStatePreserverConfig;
  private stateSerializer: StateSerializer;

  constructor(config: GameStatePreserverConfig) {
    this.config = config;
    this.stateSerializer = new StateSerializer();
  }

  /**
   * Preserve game state for a disconnected player
   */
  public async preserveGameState(gameId: number, userId: number, state: State): Promise<void> {
    const startTime = Date.now();
    const sessionId = `preserve-${userId}-${gameId}-${Date.now()}`;

    try {
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'state-preservation',
        message: 'Starting game state preservation',
        userId,
        gameId,
        sessionId,
        data: { gamePhase: state.phase.toString() }
      });

      // Check if user already has too many preserved sessions
      await this.enforceSessionLimits(userId);

      // Serialize the game state
      const serializedState = this.serializeState(state);

      const now = Date.now();
      const expiresAt = now + this.config.preservationTimeoutMs;

      // Create or update disconnected session
      const existingSession = await DisconnectedSession.findOne({
        where: { userId, gameId }
      });

      if (existingSession) {
        existingSession.gameState = serializedState;
        existingSession.disconnectedAt = now;
        existingSession.expiresAt = expiresAt;
        existingSession.gamePhase = state.phase.toString();
        existingSession.isPlayerTurn = state.activePlayer === this.getPlayerIndex(state, userId);
        await existingSession.save();

        logger.logStructured({
          level: LogLevel.INFO,
          category: 'state-preservation',
          message: 'Updated existing session',
          userId,
          gameId,
          sessionId,
          data: {
            sessionDbId: existingSession.id,
            processingTimeMs: Date.now() - startTime
          }
        });
      } else {
        const session = new DisconnectedSession();
        session.userId = userId;
        session.gameId = gameId;
        session.gameState = serializedState;
        session.disconnectedAt = now;
        session.expiresAt = expiresAt;
        session.gamePhase = state.phase.toString();
        session.isPlayerTurn = state.activePlayer === this.getPlayerIndex(state, userId);
        await session.save();

        logger.logStructured({
          level: LogLevel.INFO,
          category: 'state-preservation',
          message: 'Created new session',
          userId,
          gameId,
          sessionId,
          data: {
            sessionDbId: session.id,
            processingTimeMs: Date.now() - startTime
          }
        });
      }

      logger.logStatePreservation(userId, gameId, true, sessionId);

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStatePreservation(userId, gameId, false, sessionId, error as Error);

      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'state-preservation',
        message: 'Error preserving game state',
        userId,
        gameId,
        sessionId,
        data: { processingTimeMs: duration },
        error: error as Error
      });

      throw new GameError(GameCoreError.ERROR_SERIALIZER,
        `Failed to preserve game state for user ${userId} in game ${gameId}: ${error}`);
    }
  }

  /**
   * Retrieve preserved game state
   */
  public async getPreservedState(gameId: number, userId: number): Promise<PreservedGameState | null> {
    const startTime = Date.now();
    const sessionId = `retrieve-${userId}-${gameId}-${Date.now()}`;

    try {
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'state-restoration',
        message: 'Retrieving preserved game state',
        userId,
        gameId,
        sessionId
      });

      const session = await DisconnectedSession.findOne({
        where: { userId, gameId }
      });

      if (!session) {
        logger.logStructured({
          level: LogLevel.WARN,
          category: 'state-restoration',
          message: 'No preserved session found',
          userId,
          gameId,
          sessionId,
          data: { processingTimeMs: Date.now() - startTime }
        });
        return null;
      }

      // Check if session has expired
      if (Date.now() > session.expiresAt) {
        logger.logSessionExpiry(userId, gameId, sessionId);
        await session.remove();

        logger.logStructured({
          level: LogLevel.WARN,
          category: 'state-restoration',
          message: 'Session expired during retrieval',
          userId,
          gameId,
          sessionId,
          data: {
            expiresAt: session.expiresAt,
            processingTimeMs: Date.now() - startTime
          }
        });
        return null;
      }

      // Deserialize the game state
      const state = this.deserializeState(session.gameState);

      const result = {
        gameId: session.gameId,
        userId: session.userId,
        state,
        preservedAt: session.disconnectedAt,
        lastActivity: session.disconnectedAt
      };

      logger.logStructured({
        level: LogLevel.INFO,
        category: 'state-restoration',
        message: 'Successfully retrieved preserved state',
        userId,
        gameId,
        sessionId,
        data: {
          preservedAt: session.disconnectedAt,
          processingTimeMs: Date.now() - startTime
        }
      });

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'state-restoration',
        message: 'Error retrieving preserved state',
        userId,
        gameId,
        sessionId,
        data: { processingTimeMs: duration },
        error: error as Error
      });

      throw new GameError(GameCoreError.ERROR_SERIALIZER,
        `Failed to retrieve preserved state for user ${userId} in game ${gameId}: ${error}`);
    }
  }

  /**
   * Remove preserved state (on successful reconnection or expiry)
   */
  public async removePreservedState(gameId: number, userId: number): Promise<void> {
    try {
      const session = await DisconnectedSession.findOne({
        where: { userId, gameId }
      });

      if (session) {
        await session.remove();
        logger.log(`[GameStatePreserver] Removed preserved state for user=${userId} game=${gameId}`);
      }

    } catch (error) {
      logger.log(`[GameStatePreserver] Error removing preserved state: ${error}`);
      throw new GameError(GameCoreError.ERROR_SERIALIZER,
        `Failed to remove preserved state for user ${userId} in game ${gameId}: ${error}`);
    }
  }

  /**
   * Check if game state is preserved for user
   */
  public async hasPreservedState(gameId: number, userId: number): Promise<boolean> {
    try {
      const session = await DisconnectedSession.findOne({
        where: { userId, gameId }
      });

      if (!session) {
        return false;
      }

      // Check if session has expired
      if (Date.now() > session.expiresAt) {
        await session.remove();
        return false;
      }

      return true;

    } catch (error) {
      logger.log(`[GameStatePreserver] Error checking preserved state: ${error}`);
      return false;
    }
  }

  /**
   * Clean up expired sessions
   */
  public async cleanupExpiredSessions(): Promise<number> {
    const startTime = Date.now();

    try {
      const now = Date.now();
      const expiredSessions = await DisconnectedSession.createQueryBuilder('session')
        .where('session.expiresAt < :now', { now })
        .getMany();

      let cleanedCount = 0;
      for (const session of expiredSessions) {
        logger.logSessionExpiry(session.userId, session.gameId);
        await session.remove();
        cleanedCount++;
      }

      const duration = Date.now() - startTime;
      logger.logCleanupOperation('game-state-preserver-expired-sessions', cleanedCount, duration);

      return cleanedCount;

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'cleanup',
        message: 'Error during GameStatePreserver cleanup',
        data: {
          operation: 'cleanup-expired-sessions',
          processingTimeMs: duration
        },
        error: error as Error
      });
      return 0;
    }
  }

  /**
   * Get all preserved sessions for a user
   */
  public async getPreservedSessionsForUser(userId: number): Promise<DisconnectedSession[]> {
    try {
      return await DisconnectedSession.find({
        where: { userId }
      });
    } catch (error) {
      logger.log(`[GameStatePreserver] Error getting sessions for user: ${error}`);
      return [];
    }
  }

  /**
   * Serialize game state with error handling
   */
  private serializeState(state: State): string {
    const startTime = Date.now();

    try {
      const result = this.stateSerializer.serialize(state);
      const duration = Date.now() - startTime;

      logger.logStructured({
        level: LogLevel.DEBUG,
        category: 'serialization',
        message: 'State serialization successful',
        data: {
          serializedLength: result.length,
          processingTimeMs: duration
        }
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'serialization',
        message: 'State serialization failed',
        data: { processingTimeMs: duration },
        error: error as Error
      });

      throw new GameError(GameCoreError.ERROR_SERIALIZER,
        `Failed to serialize game state: ${error}`);
    }
  }

  /**
   * Deserialize game state with error handling
   */
  private deserializeState(serializedState: string): State {
    const startTime = Date.now();

    try {
      const result = this.stateSerializer.deserialize(serializedState);
      const duration = Date.now() - startTime;

      logger.logStructured({
        level: LogLevel.DEBUG,
        category: 'deserialization',
        message: 'State deserialization successful',
        data: {
          serializedLength: serializedState.length,
          processingTimeMs: duration
        }
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'deserialization',
        message: 'State deserialization failed',
        data: {
          serializedLength: serializedState.length,
          processingTimeMs: duration
        },
        error: error as Error
      });

      throw new GameError(GameCoreError.ERROR_SERIALIZER,
        `Failed to deserialize game state: ${error}`);
    }
  }

  /**
   * Enforce session limits per user
   */
  private async enforceSessionLimits(userId: number): Promise<void> {
    const sessions = await this.getPreservedSessionsForUser(userId);

    if (sessions.length >= this.config.maxPreservedSessionsPerUser) {
      // Remove oldest session
      const oldestSession = sessions.sort((a, b) => a.disconnectedAt - b.disconnectedAt)[0];
      await oldestSession.remove();
      logger.log(`[GameStatePreserver] Removed oldest session for user=${userId} to enforce limits`);
    }
  }

  /**
   * Get player index for a user in the game state
   */
  private getPlayerIndex(state: State, userId: number): number {
    // This is a simplified implementation - in reality, you'd need to map
    // the userId to the player index based on the game's player mapping
    // For now, we'll return 0 as a placeholder
    return 0;
  }

  /**
   * Update configuration at runtime
   */
  public updateConfig(newConfig: Partial<GameStatePreserverConfig>): void {
    this.config = { ...this.config, ...newConfig };

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'state-preservation',
      message: 'GameStatePreserver configuration updated',
      data: { newConfig: this.config }
    });
  }

  /**
   * Get current configuration
   */
  public getConfig(): GameStatePreserverConfig {
    return { ...this.config };
  }
}