import { logger, ReconnectionMetrics, LogEntry, LogLevel } from '../../utils/logger';
import { ReconnectionManager } from './reconnection-manager';
import { ConnectionMonitor } from './connection-monitor';

export interface SystemHealthMetrics {
  reconnectionSystem: ReconnectionMetrics;
  activeConnections: number;
  activeDisconnectedSessions: number;
  systemUptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  lastUpdated: number;
}

export interface DetailedMetrics {
  systemHealth: SystemHealthMetrics;
  connectionQualityDistribution: { [quality: string]: number };
  recentErrors: LogEntry[];
  performanceMetrics: {
    averageDisconnectionHandlingTime: number;
    averageReconnectionTime: number;
    averageStatePreservationTime: number;
    averageStateRestorationTime: number;
  };
}

export class ReconnectionMonitoringService {
  private reconnectionManager: ReconnectionManager;
  private connectionMonitor: ConnectionMonitor;
  private startTime: number;
  private metricsUpdateInterval: NodeJS.Timeout | null = null;
  private currentMetrics: SystemHealthMetrics | null = null;

  constructor(
    reconnectionManager: ReconnectionManager,
    connectionMonitor: ConnectionMonitor
  ) {
    this.reconnectionManager = reconnectionManager;
    this.connectionMonitor = connectionMonitor;
    this.startTime = Date.now();

    // Start periodic metrics collection
    this.startMetricsCollection();
  }

  /**
   * Get current system health metrics
   */
  public async getSystemHealthMetrics(): Promise<SystemHealthMetrics> {
    const reconnectionMetrics = logger.getReconnectionMetrics();
    const activeConnections = this.connectionMonitor.getMonitoredConnections().length;
    const activeDisconnectedSessions = await this.getActiveDisconnectedSessionsCount();

    const metrics: SystemHealthMetrics = {
      reconnectionSystem: reconnectionMetrics,
      activeConnections,
      activeDisconnectedSessions,
      systemUptime: Date.now() - this.startTime,
      memoryUsage: process.memoryUsage(),
      lastUpdated: Date.now()
    };

    this.currentMetrics = metrics;
    return metrics;
  }

  /**
   * Get detailed metrics including performance and error information
   */
  public async getDetailedMetrics(): Promise<DetailedMetrics> {
    const systemHealth = await this.getSystemHealthMetrics();
    const connectionQualityDistribution = this.getConnectionQualityDistribution();
    const recentErrors = logger.getRecentLogs(undefined, LogLevel.ERROR, 50);
    const performanceMetrics = this.calculatePerformanceMetrics();

    return {
      systemHealth,
      connectionQualityDistribution,
      recentErrors,
      performanceMetrics
    };
  }

  /**
   * Get metrics for a specific time range
   */
  public getMetricsForTimeRange(startTime: number, endTime: number): LogEntry[] {
    return logger.exportLogs(undefined, startTime, endTime);
  }

  /**
   * Get metrics for a specific category
   */
  public getMetricsByCategory(category: string, limit: number = 100): LogEntry[] {
    return logger.getRecentLogs(category, undefined, limit);
  }

  /**
   * Get error summary by category
   */
  public getErrorSummary(): { [category: string]: { [level: string]: number } } {
    return logger.getLogSummary();
  }

  /**
   * Get reconnection success rate
   */
  public getReconnectionSuccessRate(): number {
    const metrics = logger.getReconnectionMetrics();
    if (metrics.totalReconnectionAttempts === 0) {
      return 0;
    }
    return (metrics.successfulReconnections / metrics.totalReconnectionAttempts) * 100;
  }

  /**
   * Get system alerts based on current metrics
   */
  public async getSystemAlerts(): Promise<SystemAlert[]> {
    const alerts: SystemAlert[] = [];
    const metrics = await this.getSystemHealthMetrics();
    const successRate = this.getReconnectionSuccessRate();

    // Check reconnection success rate
    if (successRate < 80 && metrics.reconnectionSystem.totalReconnectionAttempts > 10) {
      alerts.push({
        level: 'warning',
        category: 'reconnection-performance',
        message: `Low reconnection success rate: ${successRate.toFixed(1)}%`,
        data: { successRate, attempts: metrics.reconnectionSystem.totalReconnectionAttempts }
      });
    }

    // Check error rate
    if (metrics.reconnectionSystem.errorCount > 50) {
      alerts.push({
        level: 'error',
        category: 'error-rate',
        message: `High error count: ${metrics.reconnectionSystem.errorCount}`,
        data: { errorCount: metrics.reconnectionSystem.errorCount }
      });
    }

    // Check memory usage
    const memoryUsageMB = metrics.memoryUsage.heapUsed / 1024 / 1024;
    if (memoryUsageMB > 500) { // Alert if using more than 500MB
      alerts.push({
        level: 'warning',
        category: 'memory-usage',
        message: `High memory usage: ${memoryUsageMB.toFixed(1)}MB`,
        data: { memoryUsageMB }
      });
    }

    // Check for expired sessions
    if (metrics.reconnectionSystem.expiredSessions > 100) {
      alerts.push({
        level: 'info',
        category: 'expired-sessions',
        message: `High number of expired sessions: ${metrics.reconnectionSystem.expiredSessions}`,
        data: { expiredSessions: metrics.reconnectionSystem.expiredSessions }
      });
    }

    return alerts;
  }

  /**
   * Reset all metrics
   */
  public resetMetrics(): void {
    logger.resetMetrics();
    this.startTime = Date.now();

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'monitoring',
      message: 'Metrics reset by administrator',
      data: { resetTime: Date.now() }
    });
  }

  /**
   * Export metrics to JSON format
   */
  public async exportMetrics(format: 'json' | 'csv' = 'json'): Promise<string> {
    const detailedMetrics = await this.getDetailedMetrics();

    if (format === 'json') {
      return JSON.stringify(detailedMetrics, null, 2);
    } else {
      // Simple CSV export for basic metrics
      const metrics = detailedMetrics.systemHealth.reconnectionSystem;
      const csvData = [
        'Metric,Value',
        `Total Disconnections,${metrics.totalDisconnections}`,
        `Total Reconnection Attempts,${metrics.totalReconnectionAttempts}`,
        `Successful Reconnections,${metrics.successfulReconnections}`,
        `Failed Reconnections,${metrics.failedReconnections}`,
        `Average Reconnection Time,${metrics.averageReconnectionTime}`,
        `Expired Sessions,${metrics.expiredSessions}`,
        `Preserved States,${metrics.preservedStatesCount}`,
        `Error Count,${metrics.errorCount}`,
        `Success Rate,${this.getReconnectionSuccessRate().toFixed(2)}%`
      ];
      return csvData.join('\n');
    }
  }

  /**
   * Start periodic metrics collection
   */
  private startMetricsCollection(): void {
    this.metricsUpdateInterval = setInterval(async () => {
      try {
        await this.getSystemHealthMetrics();

        // Log periodic health check
        logger.logStructured({
          level: LogLevel.DEBUG,
          category: 'monitoring',
          message: 'Periodic health check completed',
          data: {
            timestamp: Date.now(),
            activeConnections: this.currentMetrics?.activeConnections,
            activeDisconnectedSessions: this.currentMetrics?.activeDisconnectedSessions
          }
        });
      } catch (error) {
        logger.logStructured({
          level: LogLevel.ERROR,
          category: 'monitoring',
          message: 'Error during periodic metrics collection',
          error: error as Error
        });
      }
    }, 60000); // Update every minute
  }

  /**
   * Stop metrics collection
   */
  public dispose(): void {
    if (this.metricsUpdateInterval) {
      clearInterval(this.metricsUpdateInterval);
      this.metricsUpdateInterval = null;
    }

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'monitoring',
      message: 'Monitoring service disposed',
      data: { uptime: Date.now() - this.startTime }
    });
  }

  /**
   * Get count of active disconnected sessions
   */
  private async getActiveDisconnectedSessionsCount(): Promise<number> {
    try {
      const sessions = await this.reconnectionManager.getActiveDisconnectedSessions();
      return sessions.length;
    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'monitoring',
        message: 'Error getting active disconnected sessions count',
        error: error as Error
      });
      return 0;
    }
  }

  /**
   * Get connection quality distribution
   */
  private getConnectionQualityDistribution(): { [quality: string]: number } {
    const connections = this.connectionMonitor.getMonitoredConnections();
    const distribution: { [quality: string]: number } = {
      excellent: 0,
      good: 0,
      poor: 0,
      unstable: 0
    };

    for (const connection of connections) {
      distribution[connection.connectionQuality]++;
    }

    return distribution;
  }

  /**
   * Calculate performance metrics from recent logs
   */
  private calculatePerformanceMetrics(): DetailedMetrics['performanceMetrics'] {
    const recentLogs = logger.getRecentLogs(undefined, undefined, 1000);

    // Extract timing data from logs
    const disconnectionTimes: number[] = [];
    const reconnectionTimes: number[] = [];
    const preservationTimes: number[] = [];
    const restorationTimes: number[] = [];

    for (const log of recentLogs) {
      if (log.data?.processingTimeMs) {
        switch (log.category) {
          case 'reconnection':
            if (log.message.includes('Disconnection handled')) {
              disconnectionTimes.push(log.data.processingTimeMs);
            } else if (log.message.includes('reconnection')) {
              reconnectionTimes.push(log.data.processingTimeMs);
            }
            break;
          case 'state-preservation':
            preservationTimes.push(log.data.processingTimeMs);
            break;
          case 'state-restoration':
            restorationTimes.push(log.data.processingTimeMs);
            break;
        }
      }
    }

    return {
      averageDisconnectionHandlingTime: this.calculateAverage(disconnectionTimes),
      averageReconnectionTime: this.calculateAverage(reconnectionTimes),
      averageStatePreservationTime: this.calculateAverage(preservationTimes),
      averageStateRestorationTime: this.calculateAverage(restorationTimes)
    };
  }

  /**
   * Calculate average of an array of numbers
   */
  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return Math.round(sum / numbers.length);
  }
}

export interface SystemAlert {
  level: 'info' | 'warning' | 'error';
  category: string;
  message: string;
  data?: any;
}