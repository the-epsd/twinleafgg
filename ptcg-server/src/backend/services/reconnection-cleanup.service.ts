import { DisconnectedSession } from '../../storage/model/disconnected-session';
import { logger, LogLevel } from '../../utils/logger';
import { Scheduler } from '../../utils/scheduler';
import { GameStatePreserver } from './game-state-preserver';
import { ReconnectionConfigManager } from './reconnection-config-manager';

export interface CleanupMetrics {
  expiredSessionsRemoved: number;
  orphanedStatesRemoved: number;
  databaseOptimizationTime: number;
  memoryFreed: number;
  lastCleanupTime: number;
  totalCleanupOperations: number;
}

export interface MaintenanceConfig {
  cleanupIntervalMs: number;
  databaseOptimizationIntervalMs: number;
  memoryCleanupThresholdMb: number;
  maxSessionAge: number;
  enableScheduledCleanup: boolean;
  enableDatabaseOptimization: boolean;
  enableMemoryManagement: boolean;
}

export class ReconnectionCleanupService {
  private gameStatePreserver: GameStatePreserver;
  private scheduler: Scheduler;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private maintenanceInterval: NodeJS.Timeout | null = null;
  private isShuttingDown = false;
  private activeCleanupPromises: Promise<void>[] = [];

  private metrics: CleanupMetrics = {
    expiredSessionsRemoved: 0,
    orphanedStatesRemoved: 0,
    databaseOptimizationTime: 0,
    memoryFreed: 0,
    lastCleanupTime: 0,
    totalCleanupOperations: 0
  };

  private config: MaintenanceConfig = {
    cleanupIntervalMs: 5 * 60 * 1000, // 5 minutes
    databaseOptimizationIntervalMs: 30 * 60 * 1000, // 30 minutes - more frequent DB optimization
    memoryCleanupThresholdMb: 700, // 700MB - reduce CPU from frequent GC
    maxSessionAge: 6 * 60 * 60 * 1000, // 6 hours - shorter session retention
    enableScheduledCleanup: true,
    enableDatabaseOptimization: true,
    enableMemoryManagement: true
  };

  constructor(
    gameStatePreserver: GameStatePreserver,
    configManager: ReconnectionConfigManager,
    maintenanceConfig?: Partial<MaintenanceConfig>
  ) {
    this.gameStatePreserver = gameStatePreserver;
    this.scheduler = Scheduler.getInstance();

    if (maintenanceConfig) {
      this.config = { ...this.config, ...maintenanceConfig };
    }

    this.startScheduledTasks();

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'cleanup',
      message: 'ReconnectionCleanupService initialized',
      data: { config: this.config }
    });
  }

  /**
   * Start scheduled cleanup and maintenance tasks
   */
  private startScheduledTasks(): void {
    if (this.config.enableScheduledCleanup) {
      this.startCleanupInterval();
    }

    if (this.config.enableDatabaseOptimization) {
      this.startMaintenanceInterval();
    }

    // Register with scheduler for daily maintenance
    this.scheduler.run(this.performDailyMaintenance.bind(this), 1);

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'cleanup',
      message: 'Scheduled cleanup tasks started',
      data: {
        cleanupEnabled: this.config.enableScheduledCleanup,
        maintenanceEnabled: this.config.enableDatabaseOptimization,
        cleanupIntervalMs: this.config.cleanupIntervalMs,
        maintenanceIntervalMs: this.config.databaseOptimizationIntervalMs
      }
    });
  }

  /**
   * Start cleanup interval for expired sessions
   */
  private startCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(async () => {
      if (!this.isShuttingDown) {
        await this.performScheduledCleanup();
      }
    }, this.config.cleanupIntervalMs);

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'cleanup',
      message: 'Cleanup interval started',
      data: { intervalMs: this.config.cleanupIntervalMs }
    });
  }

  /**
   * Start maintenance interval for database optimization
   */
  private startMaintenanceInterval(): void {
    if (this.maintenanceInterval) {
      clearInterval(this.maintenanceInterval);
    }

    this.maintenanceInterval = setInterval(async () => {
      if (!this.isShuttingDown) {
        await this.performDatabaseMaintenance();
      }
    }, this.config.databaseOptimizationIntervalMs);

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'maintenance',
      message: 'Database maintenance interval started',
      data: { intervalMs: this.config.databaseOptimizationIntervalMs }
    });
  }

  /**
   * Perform scheduled cleanup of expired sessions
   */
  public async performScheduledCleanup(): Promise<void> {
    const startTime = Date.now();
    const operationId = `cleanup-${Date.now()}`;

    try {
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'cleanup',
        message: 'Starting scheduled cleanup',
        data: { operationId }
      });

      // Clean up expired disconnected sessions
      const expiredCount = await this.cleanupExpiredSessions();

      // Clean up orphaned game states
      const orphanedCount = await this.cleanupOrphanedGameStates();

      // Perform memory cleanup if needed
      const memoryFreed = await this.performMemoryCleanup();

      // Update metrics
      this.metrics.expiredSessionsRemoved += expiredCount;
      this.metrics.orphanedStatesRemoved += orphanedCount;
      this.metrics.memoryFreed += memoryFreed;
      this.metrics.lastCleanupTime = Date.now();
      this.metrics.totalCleanupOperations++;

      const duration = Date.now() - startTime;

      logger.logCleanupOperation('scheduled-cleanup', expiredCount + orphanedCount, duration);

      logger.logStructured({
        level: LogLevel.INFO,
        category: 'cleanup',
        message: 'Scheduled cleanup completed',
        data: {
          operationId,
          expiredSessionsRemoved: expiredCount,
          orphanedStatesRemoved: orphanedCount,
          memoryFreedMb: Math.round(memoryFreed / (1024 * 1024)),
          durationMs: duration
        }
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'cleanup',
        message: 'Error during scheduled cleanup',
        data: { operationId, durationMs: duration },
        error: error as Error
      });
    }
  }

  /**
   * Clean up expired disconnected sessions
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
        try {
          // Clean up preserved game state first
          await this.gameStatePreserver.removePreservedState(session.gameId, session.userId);

          // Remove the session record
          await session.remove();
          cleanedCount++;

          logger.logSessionExpiry(session.userId, session.gameId);
        } catch (error) {
          logger.logStructured({
            level: LogLevel.ERROR,
            category: 'cleanup',
            message: 'Error removing expired session',
            data: {
              sessionId: session.id,
              userId: session.userId,
              gameId: session.gameId
            },
            error: error as Error
          });
        }
      }

      const duration = Date.now() - startTime;
      logger.logCleanupOperation('expired-sessions', cleanedCount, duration);

      return cleanedCount;

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'cleanup',
        message: 'Error during expired sessions cleanup',
        data: { durationMs: duration },
        error: error as Error
      });
      return 0;
    }
  }

  /**
   * Clean up orphaned game states (states without corresponding sessions)
   */
  public async cleanupOrphanedGameStates(): Promise<number> {
    const startTime = Date.now();

    try {
      // This would typically involve checking for preserved states that don't have
      // corresponding active sessions. Since GameStatePreserver handles this internally,
      // we'll delegate to it.
      const cleanedCount = await this.gameStatePreserver.cleanupExpiredSessions();

      const duration = Date.now() - startTime;
      logger.logCleanupOperation('orphaned-game-states', cleanedCount, duration);

      return cleanedCount;

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'cleanup',
        message: 'Error during orphaned game states cleanup',
        data: { durationMs: duration },
        error: error as Error
      });
      return 0;
    }
  }

  /**
   * Perform memory cleanup if memory usage exceeds threshold
   */
  public async performMemoryCleanup(): Promise<number> {
    if (!this.config.enableMemoryManagement) {
      return 0;
    }

    const startTime = Date.now();

    try {
      const memoryUsage = process.memoryUsage();
      const heapUsedMb = memoryUsage.heapUsed / (1024 * 1024);

      if (heapUsedMb > this.config.memoryCleanupThresholdMb) {
        logger.logStructured({
          level: LogLevel.WARN,
          category: 'memory-management',
          message: 'Memory usage exceeds threshold, performing cleanup',
          data: {
            heapUsedMb: Math.round(heapUsedMb),
            thresholdMb: this.config.memoryCleanupThresholdMb,
            rss: Math.round(memoryUsage.rss / (1024 * 1024)),
            external: Math.round(memoryUsage.external / (1024 * 1024))
          }
        });

        // Perform aggressive cleanup before GC
        await this.performAggressiveCleanup();

        // Force garbage collection if available
        if (global.gc) {
          const beforeGc = process.memoryUsage().heapUsed;
          global.gc();
          const afterGc = process.memoryUsage().heapUsed;
          const freed = beforeGc - afterGc;

          logger.logStructured({
            level: LogLevel.INFO,
            category: 'memory-management',
            message: 'Garbage collection completed',
            data: {
              memoryFreedMb: Math.round(freed / (1024 * 1024)),
              heapBeforeMb: Math.round(beforeGc / (1024 * 1024)),
              heapAfterMb: Math.round(afterGc / (1024 * 1024))
            }
          });

          return freed;
        } else {
          logger.logStructured({
            level: LogLevel.WARN,
            category: 'memory-management',
            message: 'Garbage collection not available (run with --expose-gc)',
            data: { heapUsedMb: Math.round(heapUsedMb) }
          });
        }
      }

      return 0;

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'memory-management',
        message: 'Error during memory cleanup',
        data: { durationMs: duration },
        error: error as Error
      });
      return 0;
    }
  }

  /**
   * Perform aggressive memory cleanup operations
   */
  private async performAggressiveCleanup(): Promise<void> {
    try {
      // Clean up expired sessions more aggressively
      const expiredCount = await this.cleanupExpiredSessions();

      // Clean up orphaned game states
      const orphanedCount = await this.cleanupOrphanedGameStates();

      // Clean up old sessions beyond normal retention
      const oldCount = await this.cleanupOldSessions();

      logger.logStructured({
        level: LogLevel.INFO,
        category: 'memory-management',
        message: 'Aggressive cleanup completed',
        data: {
          expiredSessionsRemoved: expiredCount,
          orphanedStatesRemoved: orphanedCount,
          oldSessionsRemoved: oldCount
        }
      });

    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'memory-management',
        message: 'Error during aggressive cleanup',
        error: error as Error
      });
    }
  }

  /**
   * Perform database maintenance tasks
   */
  public async performDatabaseMaintenance(): Promise<void> {
    const startTime = Date.now();
    const operationId = `db-maintenance-${Date.now()}`;

    try {
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'maintenance',
        message: 'Starting database maintenance',
        data: { operationId }
      });

      // Clean up old sessions beyond max age
      await this.cleanupOldSessions();

      // Optimize database tables (this would be database-specific)
      await this.optimizeSessionTable();

      // Update metrics
      this.metrics.databaseOptimizationTime = Date.now() - startTime;

      const duration = Date.now() - startTime;

      logger.logStructured({
        level: LogLevel.INFO,
        category: 'maintenance',
        message: 'Database maintenance completed',
        data: { operationId, durationMs: duration }
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'maintenance',
        message: 'Error during database maintenance',
        data: { operationId, durationMs: duration },
        error: error as Error
      });
    }
  }

  /**
   * Clean up sessions older than max age
   */
  private async cleanupOldSessions(): Promise<number> {
    const startTime = Date.now();

    try {
      const cutoffTime = Date.now() - this.config.maxSessionAge;

      const oldSessions = await DisconnectedSession.createQueryBuilder('session')
        .where('session.disconnectedAt < :cutoffTime', { cutoffTime })
        .getMany();

      let cleanedCount = 0;
      for (const session of oldSessions) {
        try {
          await this.gameStatePreserver.removePreservedState(session.gameId, session.userId);
          await session.remove();
          cleanedCount++;
        } catch (error) {
          logger.logStructured({
            level: LogLevel.ERROR,
            category: 'maintenance',
            message: 'Error removing old session',
            data: {
              sessionId: session.id,
              userId: session.userId,
              gameId: session.gameId,
              age: Date.now() - session.disconnectedAt
            },
            error: error as Error
          });
        }
      }

      const duration = Date.now() - startTime;
      logger.logCleanupOperation('old-sessions', cleanedCount, duration);

      return cleanedCount;

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'maintenance',
        message: 'Error during old sessions cleanup',
        data: { durationMs: duration },
        error: error as Error
      });
      return 0;
    }
  }

  /**
   * Optimize reconnection-related database tables
   */
  private async optimizeSessionTable(): Promise<void> {
    const startTime = Date.now();
    const tablesToOptimize = [
      'disconnected_session',
      'player_session',
      'persisted_game_state',
      'connection_metrics'
    ];

    try {
      for (const tableName of tablesToOptimize) {
        const tableStartTime = Date.now();

        try {
          // For MySQL, use OPTIMIZE TABLE to optimize the database
          // For SQLite, this would be VACUUM
          await DisconnectedSession.query(`OPTIMIZE TABLE ${tableName}`);

          const tableDuration = Date.now() - tableStartTime;
          logger.logStructured({
            level: LogLevel.INFO,
            category: 'maintenance',
            message: 'Database table optimization completed',
            data: { table: tableName, durationMs: tableDuration }
          });

        } catch (error) {
          const tableDuration = Date.now() - tableStartTime;
          logger.logStructured({
            level: LogLevel.ERROR,
            category: 'maintenance',
            message: 'Error during table optimization',
            data: { table: tableName, durationMs: tableDuration },
            error: error as Error
          });
        }
      }

      const totalDuration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'maintenance',
        message: 'All reconnection tables optimization completed',
        data: {
          tablesOptimized: tablesToOptimize.length,
          totalDurationMs: totalDuration
        }
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'maintenance',
        message: 'Error during database tables optimization',
        data: { durationMs: duration },
        error: error as Error
      });
    }
  }

  /**
   * Perform daily maintenance tasks
   */
  private async performDailyMaintenance(): Promise<void> {
    const startTime = Date.now();
    const operationId = `daily-maintenance-${Date.now()}`;

    try {
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'maintenance',
        message: 'Starting daily maintenance',
        data: { operationId }
      });

      // Perform comprehensive cleanup
      await this.performScheduledCleanup();

      // Perform database maintenance
      await this.performDatabaseMaintenance();

      // Reset metrics if needed
      if (Date.now() - this.metrics.lastCleanupTime > 24 * 60 * 60 * 1000) {
        this.resetMetrics();
      }

      const duration = Date.now() - startTime;

      logger.logStructured({
        level: LogLevel.INFO,
        category: 'maintenance',
        message: 'Daily maintenance completed',
        data: { operationId, durationMs: duration }
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'maintenance',
        message: 'Error during daily maintenance',
        data: { operationId, durationMs: duration },
        error: error as Error
      });
    }
  }

  /**
   * Graceful shutdown handling for preserved sessions
   */
  public async gracefulShutdown(): Promise<void> {
    const startTime = Date.now();

    try {
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'shutdown',
        message: 'Starting graceful shutdown of cleanup service'
      });

      this.isShuttingDown = true;

      // Stop scheduled tasks
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
        this.cleanupInterval = null;
      }

      if (this.maintenanceInterval) {
        clearInterval(this.maintenanceInterval);
        this.maintenanceInterval = null;
      }

      // Unregister from scheduler
      this.scheduler.stop(this.performDailyMaintenance.bind(this));

      // Wait for any active cleanup operations to complete
      if (this.activeCleanupPromises.length > 0) {
        logger.logStructured({
          level: LogLevel.INFO,
          category: 'shutdown',
          message: 'Waiting for active cleanup operations to complete',
          data: { activeOperations: this.activeCleanupPromises.length }
        });

        // Use Promise.all instead of Promise.allSettled for older TypeScript compatibility
        try {
          await Promise.all(this.activeCleanupPromises);
        } catch (error) {
          logger.logStructured({
            level: LogLevel.WARN,
            category: 'shutdown',
            message: 'Some cleanup operations failed during shutdown',
            error: error as Error
          });
        }
      }

      // Perform final cleanup
      await this.performScheduledCleanup();

      // Log final metrics
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'shutdown',
        message: 'Cleanup service shutdown completed',
        data: {
          finalMetrics: this.metrics,
          shutdownDurationMs: Date.now() - startTime
        }
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'shutdown',
        message: 'Error during graceful shutdown',
        data: { durationMs: duration },
        error: error as Error
      });
    }
  }

  /**
   * Force cleanup of all sessions for a specific user
   */
  public async forceCleanupUserSessions(userId: number): Promise<number> {
    const startTime = Date.now();

    try {
      const userSessions = await DisconnectedSession.find({
        where: { userId }
      });

      let cleanedCount = 0;
      for (const session of userSessions) {
        try {
          await this.gameStatePreserver.removePreservedState(session.gameId, session.userId);
          await session.remove();
          cleanedCount++;
        } catch (error) {
          logger.logStructured({
            level: LogLevel.ERROR,
            category: 'cleanup',
            message: 'Error during force cleanup of user session',
            data: {
              sessionId: session.id,
              userId: session.userId,
              gameId: session.gameId
            },
            error: error as Error
          });
        }
      }

      const duration = Date.now() - startTime;
      logger.logCleanupOperation(`force-cleanup-user-${userId}`, cleanedCount, duration);

      return cleanedCount;

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'cleanup',
        message: 'Error during force cleanup of user sessions',
        data: { userId, durationMs: duration },
        error: error as Error
      });
      return 0;
    }
  }

  /**
   * Get cleanup metrics
   */
  public getMetrics(): CleanupMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset cleanup metrics
   */
  public resetMetrics(): void {
    this.metrics = {
      expiredSessionsRemoved: 0,
      orphanedStatesRemoved: 0,
      databaseOptimizationTime: 0,
      memoryFreed: 0,
      lastCleanupTime: Date.now(),
      totalCleanupOperations: 0
    };

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'cleanup',
      message: 'Cleanup metrics reset'
    });
  }

  /**
   * Update maintenance configuration
   */
  public updateConfig(newConfig: Partial<MaintenanceConfig>): void {
    const oldConfig = { ...this.config };
    this.config = { ...this.config, ...newConfig };

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'cleanup',
      message: 'Maintenance configuration updated',
      data: {
        oldConfig,
        newConfig: this.config
      }
    });

    // Restart intervals if timing changed
    if (oldConfig.cleanupIntervalMs !== this.config.cleanupIntervalMs && this.config.enableScheduledCleanup) {
      this.startCleanupInterval();
    }

    if (oldConfig.databaseOptimizationIntervalMs !== this.config.databaseOptimizationIntervalMs && this.config.enableDatabaseOptimization) {
      this.startMaintenanceInterval();
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): MaintenanceConfig {
    return { ...this.config };
  }

  /**
   * Get health status of the cleanup service
   */
  public getHealthStatus(): {
    isHealthy: boolean;
    lastCleanupAge: number;
    activeOperations: number;
    isShuttingDown: boolean;
    metrics: CleanupMetrics;
    } {
    const lastCleanupAge = Date.now() - this.metrics.lastCleanupTime;
    const isHealthy = !this.isShuttingDown && lastCleanupAge < (this.config.cleanupIntervalMs * 2);

    return {
      isHealthy,
      lastCleanupAge,
      activeOperations: this.activeCleanupPromises.length,
      isShuttingDown: this.isShuttingDown,
      metrics: this.getMetrics()
    };
  }
}