import { Scheduler } from '../../utils/scheduler';
import { ReconnectionCleanupService } from './reconnection-cleanup.service';
import { logger, LogLevel } from '../../utils/logger';
import { config } from '../../config';

export interface MaintenanceTask {
  name: string;
  description: string;
  intervalCount: number; // How many scheduler ticks between executions
  lastExecuted: number;
  isEnabled: boolean;
  execute: () => Promise<void>;
}

export class ReconnectionMaintenanceScheduler {
  private scheduler: Scheduler;
  private cleanupService: ReconnectionCleanupService;
  private tasks: Map<string, MaintenanceTask> = new Map();
  private isInitialized = false;

  constructor(cleanupService: ReconnectionCleanupService) {
    this.scheduler = Scheduler.getInstance();
    this.cleanupService = cleanupService;
    this.initializeTasks();
  }

  /**
   * Initialize maintenance tasks
   */
  private initializeTasks(): void {
    // Task 1: Cleanup expired sessions (every 5 scheduler ticks = ~5 days with default 24h interval)
    this.addTask({
      name: 'cleanup-expired-sessions',
      description: 'Clean up expired disconnected sessions and preserved game states',
      intervalCount: 5,
      lastExecuted: 0,
      isEnabled: true,
      execute: async () => {
        await this.cleanupService.performScheduledCleanup();
      }
    });

    // Task 2: Database maintenance (every 7 scheduler ticks = ~7 days)
    this.addTask({
      name: 'database-maintenance',
      description: 'Optimize database tables and perform maintenance',
      intervalCount: 7,
      lastExecuted: 0,
      isEnabled: true,
      execute: async () => {
        await this.cleanupService.performDatabaseMaintenance();
      }
    });

    // Task 3: Memory cleanup (every 2 scheduler ticks = ~2 days)
    this.addTask({
      name: 'memory-cleanup',
      description: 'Perform memory cleanup and garbage collection if needed',
      intervalCount: 2,
      lastExecuted: 0,
      isEnabled: true,
      execute: async () => {
        await this.cleanupService.performMemoryCleanup();
      }
    });

    // Task 4: Metrics reset (every 30 scheduler ticks = ~30 days)
    this.addTask({
      name: 'metrics-reset',
      description: 'Reset cleanup metrics to prevent overflow',
      intervalCount: 30,
      lastExecuted: 0,
      isEnabled: true,
      execute: async () => {
        this.cleanupService.resetMetrics();
        logger.logStructured({
          level: LogLevel.INFO,
          category: 'maintenance',
          message: 'Cleanup metrics reset by scheduled task'
        });
      }
    });

    // Task 5: Health check (every scheduler tick = daily)
    this.addTask({
      name: 'health-check',
      description: 'Check health status of cleanup service and log warnings',
      intervalCount: 1,
      lastExecuted: 0,
      isEnabled: true,
      execute: async () => {
        await this.performHealthCheck();
      }
    });

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'maintenance',
      message: 'Maintenance tasks initialized',
      data: {
        taskCount: this.tasks.size,
        tasks: Array.from(this.tasks.keys())
      }
    });
  }

  /**
   * Start the maintenance scheduler
   */
  public start(): void {
    if (this.isInitialized) {
      logger.logStructured({
        level: LogLevel.WARN,
        category: 'maintenance',
        message: 'Maintenance scheduler already started'
      });
      return;
    }

    // Register with the main scheduler
    // Use interval count of 1 to check every scheduler tick (daily by default)
    this.scheduler.run(this.executeTasks.bind(this), 1);
    this.isInitialized = true;

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'maintenance',
      message: 'Maintenance scheduler started',
      data: {
        schedulerInterval: config.core.schedulerInterval,
        enabledTasks: Array.from(this.tasks.values())
          .filter(task => task.isEnabled)
          .map(task => task.name)
      }
    });
  }

  /**
   * Stop the maintenance scheduler
   */
  public stop(): void {
    if (!this.isInitialized) {
      return;
    }

    this.scheduler.stop(this.executeTasks.bind(this));
    this.isInitialized = false;

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'maintenance',
      message: 'Maintenance scheduler stopped'
    });
  }

  /**
   * Execute maintenance tasks that are due
   */
  private async executeTasks(): Promise<void> {
    const startTime = Date.now();
    const executedTasks: string[] = [];

    try {
      logger.logStructured({
        level: LogLevel.DEBUG,
        category: 'maintenance',
        message: 'Checking maintenance tasks'
      });

      for (const [taskName, task] of this.tasks) {
        if (!task.isEnabled) {
          continue;
        }

        // Check if task is due for execution
        const ticksSinceLastExecution = this.getTicksSinceLastExecution(task.lastExecuted);

        if (ticksSinceLastExecution >= task.intervalCount) {
          try {
            logger.logStructured({
              level: LogLevel.INFO,
              category: 'maintenance',
              message: `Executing maintenance task: ${taskName}`,
              data: {
                description: task.description,
                ticksSinceLastExecution,
                intervalCount: task.intervalCount
              }
            });

            const taskStartTime = Date.now();
            await task.execute();
            const taskDuration = Date.now() - taskStartTime;

            task.lastExecuted = Date.now();
            executedTasks.push(taskName);

            logger.logStructured({
              level: LogLevel.INFO,
              category: 'maintenance',
              message: `Maintenance task completed: ${taskName}`,
              data: {
                durationMs: taskDuration
              }
            });

          } catch (error) {
            logger.logStructured({
              level: LogLevel.ERROR,
              category: 'maintenance',
              message: `Error executing maintenance task: ${taskName}`,
              data: {
                description: task.description
              },
              error: error as Error
            });
          }
        }
      }

      const totalDuration = Date.now() - startTime;

      if (executedTasks.length > 0) {
        logger.logStructured({
          level: LogLevel.INFO,
          category: 'maintenance',
          message: 'Maintenance tasks execution completed',
          data: {
            executedTasks,
            totalDurationMs: totalDuration
          }
        });
      }

    } catch (error) {
      const totalDuration = Date.now() - startTime;
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'maintenance',
        message: 'Error during maintenance tasks execution',
        data: {
          totalDurationMs: totalDuration
        },
        error: error as Error
      });
    }
  }

  /**
   * Add a maintenance task
   */
  public addTask(task: MaintenanceTask): void {
    this.tasks.set(task.name, task);

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'maintenance',
      message: `Added maintenance task: ${task.name}`,
      data: {
        description: task.description,
        intervalCount: task.intervalCount,
        isEnabled: task.isEnabled
      }
    });
  }

  /**
   * Remove a maintenance task
   */
  public removeTask(taskName: string): boolean {
    const removed = this.tasks.delete(taskName);

    if (removed) {
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'maintenance',
        message: `Removed maintenance task: ${taskName}`
      });
    }

    return removed;
  }

  /**
   * Enable or disable a maintenance task
   */
  public setTaskEnabled(taskName: string, enabled: boolean): boolean {
    const task = this.tasks.get(taskName);
    if (!task) {
      return false;
    }

    task.isEnabled = enabled;

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'maintenance',
      message: `${enabled ? 'Enabled' : 'Disabled'} maintenance task: ${taskName}`
    });

    return true;
  }

  /**
   * Update task interval
   */
  public updateTaskInterval(taskName: string, intervalCount: number): boolean {
    const task = this.tasks.get(taskName);
    if (!task) {
      return false;
    }

    const oldInterval = task.intervalCount;
    task.intervalCount = intervalCount;

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'maintenance',
      message: `Updated maintenance task interval: ${taskName}`,
      data: {
        oldInterval,
        newInterval: intervalCount
      }
    });

    return true;
  }

  /**
   * Get all maintenance tasks
   */
  public getTasks(): Map<string, MaintenanceTask> {
    return new Map(this.tasks);
  }

  /**
   * Get task status
   */
  public getTaskStatus(taskName: string): {
    exists: boolean;
    isEnabled: boolean;
    lastExecuted: number;
    nextExecution: number;
    ticksSinceLastExecution: number;
    ticksUntilNextExecution: number;
  } | null {
    const task = this.tasks.get(taskName);
    if (!task) {
      return null;
    }

    const ticksSinceLastExecution = this.getTicksSinceLastExecution(task.lastExecuted);
    const ticksUntilNextExecution = Math.max(0, task.intervalCount - ticksSinceLastExecution);
    const nextExecution = task.lastExecuted + (task.intervalCount * config.core.schedulerInterval);

    return {
      exists: true,
      isEnabled: task.isEnabled,
      lastExecuted: task.lastExecuted,
      nextExecution,
      ticksSinceLastExecution,
      ticksUntilNextExecution
    };
  }

  /**
   * Force execute a specific task
   */
  public async forceExecuteTask(taskName: string): Promise<boolean> {
    const task = this.tasks.get(taskName);
    if (!task) {
      return false;
    }

    try {
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'maintenance',
        message: `Force executing maintenance task: ${taskName}`,
        data: { description: task.description }
      });

      const startTime = Date.now();
      await task.execute();
      const duration = Date.now() - startTime;

      task.lastExecuted = Date.now();

      logger.logStructured({
        level: LogLevel.INFO,
        category: 'maintenance',
        message: `Force execution completed: ${taskName}`,
        data: { durationMs: duration }
      });

      return true;

    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'maintenance',
        message: `Error during force execution: ${taskName}`,
        data: { description: task.description },
        error: error as Error
      });

      return false;
    }
  }

  /**
   * Perform health check of the cleanup service
   */
  private async performHealthCheck(): Promise<void> {
    try {
      const health = this.cleanupService.getHealthStatus();
      const metrics = this.cleanupService.getMetrics();

      if (!health.isHealthy) {
        logger.logStructured({
          level: LogLevel.WARN,
          category: 'health-check',
          message: 'Cleanup service health check failed',
          data: {
            lastCleanupAge: health.lastCleanupAge,
            activeOperations: health.activeOperations,
            isShuttingDown: health.isShuttingDown
          }
        });
      }

      // Log metrics summary
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'health-check',
        message: 'Cleanup service health check completed',
        data: {
          isHealthy: health.isHealthy,
          metrics: {
            totalCleanupOperations: metrics.totalCleanupOperations,
            expiredSessionsRemoved: metrics.expiredSessionsRemoved,
            orphanedStatesRemoved: metrics.orphanedStatesRemoved,
            lastCleanupTime: metrics.lastCleanupTime
          }
        }
      });

      // Warn if cleanup hasn't run in a long time
      if (health.lastCleanupAge > 2 * 24 * 60 * 60 * 1000) { // 2 days
        logger.logStructured({
          level: LogLevel.WARN,
          category: 'health-check',
          message: 'Cleanup service has not run recently',
          data: {
            lastCleanupAge: health.lastCleanupAge,
            lastCleanupAgeHours: Math.round(health.lastCleanupAge / (60 * 60 * 1000))
          }
        });
      }

    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'health-check',
        message: 'Error during health check',
        error: error as Error
      });
    }
  }

  /**
   * Calculate ticks since last execution
   */
  private getTicksSinceLastExecution(lastExecuted: number): number {
    if (lastExecuted === 0) {
      return Number.MAX_SAFE_INTEGER; // Never executed
    }

    const timeSinceLastExecution = Date.now() - lastExecuted;
    return Math.floor(timeSinceLastExecution / config.core.schedulerInterval);
  }

  /**
   * Get scheduler status
   */
  public getStatus(): {
    isInitialized: boolean;
    taskCount: number;
    enabledTaskCount: number;
    tasks: Array<{
      name: string;
      description: string;
      isEnabled: boolean;
      lastExecuted: number;
      intervalCount: number;
      nextExecution: number;
    }>;
  } {
    const tasks = Array.from(this.tasks.values()).map(task => ({
      name: task.name,
      description: task.description,
      isEnabled: task.isEnabled,
      lastExecuted: task.lastExecuted,
      intervalCount: task.intervalCount,
      nextExecution: task.lastExecuted + (task.intervalCount * config.core.schedulerInterval)
    }));

    return {
      isInitialized: this.isInitialized,
      taskCount: this.tasks.size,
      enabledTaskCount: tasks.filter(task => task.isEnabled).length,
      tasks
    };
  }
}