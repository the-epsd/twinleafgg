import { logger, LogLevel } from '../../utils/logger';

export interface MemoryStats {
  heapUsed: number;
  heapTotal: number;
  rss: number;
  external: number;
  arrayBuffers: number;
  heapUsedMb: number;
  rssMb: number;
  externalMb: number;
  timestamp: number;
}

export interface MemoryAlert {
  level: 'info' | 'warning' | 'critical';
  message: string;
  data: MemoryStats;
  timestamp: number;
}

export class MemoryMonitorService {
  private static instance: MemoryMonitorService;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;
  private memoryHistory: MemoryStats[] = [];
  private maxHistorySize = 100;
  private alertThresholds = {
    warning: 400, // MB
    critical: 600 // MB
  };

  public static getInstance(): MemoryMonitorService {
    if (!MemoryMonitorService.instance) {
      MemoryMonitorService.instance = new MemoryMonitorService();
    }
    return MemoryMonitorService.instance;
  }

  /**
   * Start memory monitoring
   */
  public startMonitoring(intervalMs: number = 30000): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.collectMemoryStats();
    }, intervalMs);

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'memory-monitor',
      message: 'Memory monitoring started',
      data: { intervalMs }
    });
  }

  /**
   * Stop memory monitoring
   */
  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'memory-monitor',
      message: 'Memory monitoring stopped'
    });
  }

  /**
   * Collect current memory statistics
   */
  public collectMemoryStats(): MemoryStats {
    const memoryUsage = process.memoryUsage();
    const stats: MemoryStats = {
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      rss: memoryUsage.rss,
      external: memoryUsage.external,
      arrayBuffers: (memoryUsage as any).arrayBuffers || 0,
      heapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
      rssMb: Math.round(memoryUsage.rss / (1024 * 1024)),
      externalMb: Math.round(memoryUsage.external / (1024 * 1024)),
      timestamp: Date.now()
    };

    // Add to history
    this.memoryHistory.push(stats);
    if (this.memoryHistory.length > this.maxHistorySize) {
      this.memoryHistory.shift();
    }

    // Check for alerts
    this.checkMemoryAlerts(stats);

    return stats;
  }

  /**
   * Get current memory statistics
   */
  public getCurrentMemoryStats(): MemoryStats {
    return this.collectMemoryStats();
  }

  /**
   * Get memory history
   */
  public getMemoryHistory(): MemoryStats[] {
    return [...this.memoryHistory];
  }

  /**
   * Get memory trend analysis
   */
  public getMemoryTrend(): {
    isIncreasing: boolean;
    averageGrowth: number;
    peakUsage: number;
    recommendation: string;
    } {
    if (this.memoryHistory.length < 2) {
      return {
        isIncreasing: false,
        averageGrowth: 0,
        peakUsage: 0,
        recommendation: 'Insufficient data for trend analysis'
      };
    }

    const recent = this.memoryHistory.slice(-10); // Last 10 measurements
    const growth = recent.map((stat, index) => {
      if (index === 0) return 0;
      return stat.heapUsedMb - recent[index - 1].heapUsedMb;
    }).slice(1);

    const averageGrowth = growth.reduce((sum, change) => sum + change, 0) / growth.length;
    const peakUsage = Math.max(...this.memoryHistory.map(s => s.heapUsedMb));
    const isIncreasing = averageGrowth > 5; // Growing by more than 5MB per measurement

    let recommendation = 'Memory usage is stable';
    if (isIncreasing) {
      recommendation = 'Memory usage is increasing. Consider investigating memory leaks.';
    } else if (peakUsage > this.alertThresholds.critical) {
      recommendation = 'Peak memory usage is critical. Immediate action required.';
    } else if (peakUsage > this.alertThresholds.warning) {
      recommendation = 'Peak memory usage is high. Monitor closely.';
    }

    return {
      isIncreasing,
      averageGrowth: Math.round(averageGrowth * 100) / 100,
      peakUsage,
      recommendation
    };
  }

  /**
   * Check for memory alerts
   */
  private checkMemoryAlerts(stats: MemoryStats): void {
    const alerts: MemoryAlert[] = [];

    if (stats.heapUsedMb > this.alertThresholds.critical) {
      alerts.push({
        level: 'critical',
        message: `Critical memory usage: ${stats.heapUsedMb}MB`,
        data: stats,
        timestamp: Date.now()
      });
    } else if (stats.heapUsedMb > this.alertThresholds.warning) {
      alerts.push({
        level: 'warning',
        message: `High memory usage: ${stats.heapUsedMb}MB`,
        data: stats,
        timestamp: Date.now()
      });
    }

    // Log alerts
    alerts.forEach(alert => {
      logger.logStructured({
        level: alert.level === 'critical' ? LogLevel.ERROR : LogLevel.WARN,
        category: 'memory-monitor',
        message: alert.message,
        data: {
          heapUsedMb: alert.data.heapUsedMb,
          rssMb: alert.data.rssMb,
          externalMb: alert.data.externalMb,
          timestamp: alert.timestamp
        }
      });
    });
  }

  /**
   * Force garbage collection and return memory freed
   */
  public forceGarbageCollection(): number {
    if (!global.gc) {
      logger.logStructured({
        level: LogLevel.WARN,
        category: 'memory-monitor',
        message: 'Garbage collection not available (run with --expose-gc)'
      });
      return 0;
    }

    const beforeGc = process.memoryUsage().heapUsed;
    global.gc();
    const afterGc = process.memoryUsage().heapUsed;
    const freed = beforeGc - afterGc;

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'memory-monitor',
      message: 'Forced garbage collection completed',
      data: {
        memoryFreedMb: Math.round(freed / (1024 * 1024)),
        heapBeforeMb: Math.round(beforeGc / (1024 * 1024)),
        heapAfterMb: Math.round(afterGc / (1024 * 1024))
      }
    });

    return freed;
  }

  /**
   * Get memory health status
   */
  public getHealthStatus(): {
    isHealthy: boolean;
    currentUsage: number;
    peakUsage: number;
    trend: string;
    recommendation: string;
    } {
    const current = this.getCurrentMemoryStats();
    const trend = this.getMemoryTrend();
    const peakUsage = Math.max(...this.memoryHistory.map(s => s.heapUsedMb));

    const isHealthy = current.heapUsedMb < this.alertThresholds.warning && !trend.isIncreasing;

    return {
      isHealthy,
      currentUsage: current.heapUsedMb,
      peakUsage,
      trend: trend.isIncreasing ? 'increasing' : 'stable',
      recommendation: trend.recommendation
    };
  }

  /**
   * Update alert thresholds
   */
  public updateThresholds(warning: number, critical: number): void {
    this.alertThresholds.warning = warning;
    this.alertThresholds.critical = critical;

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'memory-monitor',
      message: 'Memory alert thresholds updated',
      data: { warning, critical }
    });
  }

  /**
   * Clear memory history
   */
  public clearHistory(): void {
    this.memoryHistory = [];
    logger.logStructured({
      level: LogLevel.INFO,
      category: 'memory-monitor',
      message: 'Memory history cleared'
    });
  }
}
