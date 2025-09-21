import { logger, LogLevel } from '../../utils/logger';
import { MemoryMonitorService } from './memory-monitor.service';

export interface MemoryOptimizationConfig {
  enablePeriodicCleanup: boolean;
  cleanupIntervalMs: number;
  aggressiveCleanupThreshold: number; // MB
  maxMemoryUsage: number; // MB
  enableStateCompression: boolean;
  maxStateSize: number; // bytes
}

export class MemoryOptimizationService {
  private static instance: MemoryOptimizationService;
  private memoryMonitor: MemoryMonitorService;
  private config: MemoryOptimizationConfig;
  private optimizationInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  private constructor() {
    this.memoryMonitor = MemoryMonitorService.getInstance();
    this.config = {
      enablePeriodicCleanup: true,
      cleanupIntervalMs: 60000, // 1 minute
      aggressiveCleanupThreshold: 400, // MB
      maxMemoryUsage: 800, // MB
      enableStateCompression: true,
      maxStateSize: 1024 * 1024 // 1MB
    };
  }

  public static getInstance(): MemoryOptimizationService {
    if (!MemoryOptimizationService.instance) {
      MemoryOptimizationService.instance = new MemoryOptimizationService();
    }
    return MemoryOptimizationService.instance;
  }

  /**
   * Start memory optimization service
   */
  public start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.memoryMonitor.startMonitoring(30000); // Monitor every 30 seconds

    if (this.config.enablePeriodicCleanup) {
      this.optimizationInterval = setInterval(() => {
        this.performOptimization();
      }, this.config.cleanupIntervalMs);
    }

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'memory-optimization',
      message: 'Memory optimization service started',
      data: { config: this.config }
    });
  }

  /**
   * Stop memory optimization service
   */
  public stop(): void {
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
      this.optimizationInterval = null;
    }

    this.memoryMonitor.stopMonitoring();
    this.isRunning = false;

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'memory-optimization',
      message: 'Memory optimization service stopped'
    });
  }

  /**
   * Perform memory optimization
   */
  public async performOptimization(): Promise<void> {
    const startTime = Date.now();

    try {
      const memoryStats = this.memoryMonitor.getCurrentMemoryStats();
      const trend = this.memoryMonitor.getMemoryTrend();

      logger.logStructured({
        level: LogLevel.DEBUG,
        category: 'memory-optimization',
        message: 'Starting memory optimization',
        data: {
          heapUsedMb: memoryStats.heapUsedMb,
          rssMb: memoryStats.rssMb,
          trend: trend.isIncreasing ? 'increasing' : 'stable'
        }
      });

      // Perform different levels of optimization based on memory usage
      if (memoryStats.heapUsedMb > this.config.maxMemoryUsage) {
        await this.performCriticalOptimization();
      } else if (memoryStats.heapUsedMb > this.config.aggressiveCleanupThreshold) {
        await this.performAggressiveOptimization();
      } else if (trend.isIncreasing) {
        await this.performPreventiveOptimization();
      }

      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.DEBUG,
        category: 'memory-optimization',
        message: 'Memory optimization completed',
        data: { durationMs: duration }
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'memory-optimization',
        message: 'Error during memory optimization',
        data: { durationMs: duration },
        error: error as Error
      });
    }
  }

  /**
   * Perform critical memory optimization
   */
  private async performCriticalOptimization(): Promise<void> {
    logger.logStructured({
      level: LogLevel.WARN,
      category: 'memory-optimization',
      message: 'Performing critical memory optimization'
    });

    // Force garbage collection multiple times
    for (let i = 0; i < 3; i++) {
      this.memoryMonitor.forceGarbageCollection();
      await this.sleep(1000); // Wait 1 second between GC calls
    }

    // Clear caches and temporary data
    await this.clearCaches();

    // Force cleanup of expired sessions
    await this.forceCleanupExpiredSessions();

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'memory-optimization',
      message: 'Critical memory optimization completed'
    });
  }

  /**
   * Perform aggressive memory optimization
   */
  private async performAggressiveOptimization(): Promise<void> {
    logger.logStructured({
      level: LogLevel.INFO,
      category: 'memory-optimization',
      message: 'Performing aggressive memory optimization'
    });

    // Force garbage collection
    this.memoryMonitor.forceGarbageCollection();

    // Clear caches
    await this.clearCaches();

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'memory-optimization',
      message: 'Aggressive memory optimization completed'
    });
  }

  /**
   * Perform preventive memory optimization
   */
  private async performPreventiveOptimization(): Promise<void> {
    logger.logStructured({
      level: LogLevel.DEBUG,
      category: 'memory-optimization',
      message: 'Performing preventive memory optimization'
    });

    // Light garbage collection
    this.memoryMonitor.forceGarbageCollection();

    logger.logStructured({
      level: LogLevel.DEBUG,
      category: 'memory-optimization',
      message: 'Preventive memory optimization completed'
    });
  }

  /**
   * Clear various caches and temporary data
   */
  private async clearCaches(): Promise<void> {
    try {
      // Clear require cache for non-essential modules
      const cacheKeys = Object.keys(require.cache);
      const nonEssentialModules = cacheKeys.filter(key =>
        key.includes('node_modules') &&
        !key.includes('core') &&
        !key.includes('essential')
      );

      nonEssentialModules.forEach(key => {
        delete require.cache[key];
      });

      logger.logStructured({
        level: LogLevel.DEBUG,
        category: 'memory-optimization',
        message: 'Cleared require cache',
        data: { clearedModules: nonEssentialModules.length }
      });

    } catch (error) {
      logger.logStructured({
        level: LogLevel.WARN,
        category: 'memory-optimization',
        message: 'Error clearing caches',
        error: error as Error
      });
    }
  }

  /**
   * Force cleanup of expired sessions
   */
  private async forceCleanupExpiredSessions(): Promise<void> {
    try {
      // This would integrate with the existing cleanup service
      // For now, we'll just log the action
      logger.logStructured({
        level: LogLevel.DEBUG,
        category: 'memory-optimization',
        message: 'Forcing cleanup of expired sessions'
      });

      // TODO: Integrate with ReconnectionCleanupService
      // await this.cleanupService.performScheduledCleanup();

    } catch (error) {
      logger.logStructured({
        level: LogLevel.WARN,
        category: 'memory-optimization',
        message: 'Error during forced session cleanup',
        error: error as Error
      });
    }
  }

  /**
   * Get optimization status
   */
  public getStatus(): {
    isRunning: boolean;
    config: MemoryOptimizationConfig;
    memoryHealth: any;
    lastOptimization: number;
  } {
    return {
      isRunning: this.isRunning,
      config: this.config,
      memoryHealth: this.memoryMonitor.getHealthStatus(),
      lastOptimization: Date.now()
    };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<MemoryOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'memory-optimization',
      message: 'Memory optimization configuration updated',
      data: { newConfig: this.config }
    });

    // Restart if running
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  /**
   * Get memory statistics
   */
  public getMemoryStats() {
    return {
      current: this.memoryMonitor.getCurrentMemoryStats(),
      history: this.memoryMonitor.getMemoryHistory(),
      trend: this.memoryMonitor.getMemoryTrend(),
      health: this.memoryMonitor.getHealthStatus()
    };
  }

  /**
   * Utility method for sleeping
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
