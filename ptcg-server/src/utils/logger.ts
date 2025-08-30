import { config } from '../config';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
  userId?: number;
  gameId?: number;
  sessionId?: string;
  error?: Error;
}

export interface ReconnectionMetrics {
  totalDisconnections: number;
  totalReconnectionAttempts: number;
  successfulReconnections: number;
  failedReconnections: number;
  averageReconnectionTime: number;
  expiredSessions: number;
  preservedStatesCount: number;
  cleanupOperations: number;
  errorCount: number;
  lastResetTime: number;
}

export class Logger {
  private metrics: ReconnectionMetrics = {
    totalDisconnections: 0,
    totalReconnectionAttempts: 0,
    successfulReconnections: 0,
    failedReconnections: 0,
    averageReconnectionTime: 0,
    expiredSessions: 0,
    preservedStatesCount: 0,
    cleanupOperations: 0,
    errorCount: 0,
    lastResetTime: Date.now()
  };

  private reconnectionTimes: number[] = [];
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 1000;

  public log(message: string): void {
    if (!config.core.debug) {
      return;
    }
    console.log(message);
  }

  public logStructured(entry: Partial<LogEntry>): void {
    const logEntry: LogEntry = {
      timestamp: Date.now(),
      level: entry.level ?? LogLevel.INFO,
      category: entry.category ?? 'general',
      message: entry.message ?? '',
      ...entry
    };

    // Add to buffer
    this.logBuffer.push(logEntry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Console output based on debug setting and log level
    if (config.core.debug || logEntry.level >= LogLevel.WARN) {
      const timestamp = new Date(logEntry.timestamp).toISOString();
      const levelStr = LogLevel[logEntry.level];
      const prefix = `[${timestamp}] [${levelStr}] [${logEntry.category}]`;

      let output = `${prefix} ${logEntry.message}`;

      if (logEntry.userId) {
        output += ` userId=${logEntry.userId}`;
      }

      if (logEntry.gameId) {
        output += ` gameId=${logEntry.gameId}`;
      }

      if (logEntry.sessionId) {
        output += ` sessionId=${logEntry.sessionId}`;
      }

      if (logEntry.data) {
        output += ` data=${JSON.stringify(logEntry.data)}`;
      }

      console.log(output);

      if (logEntry.error) {
        console.error(logEntry.error);
      }
    }
  }

  // Reconnection-specific logging methods
  public logDisconnection(userId: number, gameId: number, reason: string, sessionId?: string): void {
    this.metrics.totalDisconnections++;

    this.logStructured({
      level: LogLevel.INFO,
      category: 'reconnection',
      message: 'Player disconnected',
      userId,
      gameId,
      sessionId,
      data: { reason, timestamp: Date.now() }
    });
  }

  public logReconnectionAttempt(userId: number, gameId: number, attemptNumber: number, sessionId?: string): void {
    this.metrics.totalReconnectionAttempts++;

    this.logStructured({
      level: LogLevel.INFO,
      category: 'reconnection',
      message: 'Reconnection attempt started',
      userId,
      gameId,
      sessionId,
      data: { attemptNumber, timestamp: Date.now() }
    });
  }

  public logReconnectionSuccess(userId: number, gameId: number, reconnectionTimeMs: number, sessionId?: string): void {
    this.metrics.successfulReconnections++;
    this.reconnectionTimes.push(reconnectionTimeMs);

    // Update average reconnection time
    const sum = this.reconnectionTimes.reduce((acc, time) => acc + time, 0);
    this.metrics.averageReconnectionTime = sum / this.reconnectionTimes.length;

    // Keep only last 100 reconnection times for average calculation
    if (this.reconnectionTimes.length > 100) {
      this.reconnectionTimes.shift();
    }

    this.logStructured({
      level: LogLevel.INFO,
      category: 'reconnection',
      message: 'Reconnection successful',
      userId,
      gameId,
      sessionId,
      data: { reconnectionTimeMs, timestamp: Date.now() }
    });
  }

  public logReconnectionFailure(userId: number, gameId: number, reason: string, sessionId?: string, error?: Error): void {
    this.metrics.failedReconnections++;
    this.metrics.errorCount++;

    this.logStructured({
      level: LogLevel.ERROR,
      category: 'reconnection',
      message: 'Reconnection failed',
      userId,
      gameId,
      sessionId,
      data: { reason, timestamp: Date.now() },
      error
    });
  }

  public logStatePreservation(userId: number, gameId: number, success: boolean, sessionId?: string, error?: Error): void {
    if (success) {
      this.metrics.preservedStatesCount++;
      this.logStructured({
        level: LogLevel.INFO,
        category: 'state-preservation',
        message: 'Game state preserved successfully',
        userId,
        gameId,
        sessionId,
        data: { timestamp: Date.now() }
      });
    } else {
      this.metrics.errorCount++;
      this.logStructured({
        level: LogLevel.ERROR,
        category: 'state-preservation',
        message: 'Failed to preserve game state',
        userId,
        gameId,
        sessionId,
        data: { timestamp: Date.now() },
        error
      });
    }
  }

  public logStateRestoration(userId: number, gameId: number, success: boolean, sessionId?: string, error?: Error): void {
    if (success) {
      this.logStructured({
        level: LogLevel.INFO,
        category: 'state-restoration',
        message: 'Game state restored successfully',
        userId,
        gameId,
        sessionId,
        data: { timestamp: Date.now() }
      });
    } else {
      this.metrics.errorCount++;
      this.logStructured({
        level: LogLevel.ERROR,
        category: 'state-restoration',
        message: 'Failed to restore game state',
        userId,
        gameId,
        sessionId,
        data: { timestamp: Date.now() },
        error
      });
    }
  }

  public logSessionExpiry(userId: number, gameId: number, sessionId?: string): void {
    this.metrics.expiredSessions++;

    this.logStructured({
      level: LogLevel.WARN,
      category: 'session-management',
      message: 'Disconnected session expired',
      userId,
      gameId,
      sessionId,
      data: { timestamp: Date.now() }
    });
  }

  public logCleanupOperation(operation: string, count: number, durationMs: number): void {
    this.metrics.cleanupOperations++;

    this.logStructured({
      level: LogLevel.INFO,
      category: 'cleanup',
      message: `Cleanup operation completed: ${operation}`,
      data: {
        operation,
        itemsProcessed: count,
        durationMs,
        timestamp: Date.now()
      }
    });
  }

  public logConnectionQualityChange(userId: number, previousQuality: string, currentQuality: string, metrics: any): void {
    this.logStructured({
      level: currentQuality === 'unstable' ? LogLevel.WARN : LogLevel.INFO,
      category: 'connection-monitor',
      message: 'Connection quality changed',
      userId,
      data: {
        previousQuality,
        currentQuality,
        metrics,
        timestamp: Date.now()
      }
    });
  }

  public logAutomaticReconnectionAttempt(userId: number, attemptNumber: number, maxAttempts: number, nextAttemptIn: number): void {
    this.logStructured({
      level: LogLevel.INFO,
      category: 'auto-reconnection',
      message: 'Automatic reconnection attempt',
      userId,
      data: {
        attemptNumber,
        maxAttempts,
        nextAttemptIn,
        timestamp: Date.now()
      }
    });
  }

  // Metrics and monitoring methods
  public getReconnectionMetrics(): ReconnectionMetrics {
    return { ...this.metrics };
  }

  public resetMetrics(): void {
    this.metrics = {
      totalDisconnections: 0,
      totalReconnectionAttempts: 0,
      successfulReconnections: 0,
      failedReconnections: 0,
      averageReconnectionTime: 0,
      expiredSessions: 0,
      preservedStatesCount: 0,
      cleanupOperations: 0,
      errorCount: 0,
      lastResetTime: Date.now()
    };
    this.reconnectionTimes = [];
  }

  public getRecentLogs(category?: string, level?: LogLevel, limit: number = 100): LogEntry[] {
    let filteredLogs = this.logBuffer;

    if (category) {
      filteredLogs = filteredLogs.filter(entry => entry.category === category);
    }

    if (level !== undefined) {
      filteredLogs = filteredLogs.filter(entry => entry.level >= level);
    }

    return filteredLogs
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  public getLogSummary(): { [category: string]: { [level: string]: number } } {
    const summary: { [category: string]: { [level: string]: number } } = {};

    for (const entry of this.logBuffer) {
      if (!summary[entry.category]) {
        summary[entry.category] = {};
      }

      const levelStr = LogLevel[entry.level];
      summary[entry.category][levelStr] = (summary[entry.category][levelStr] || 0) + 1;
    }

    return summary;
  }

  public exportLogs(category?: string, startTime?: number, endTime?: number): LogEntry[] {
    let filteredLogs = this.logBuffer;

    if (category) {
      filteredLogs = filteredLogs.filter(entry => entry.category === category);
    }

    if (startTime) {
      filteredLogs = filteredLogs.filter(entry => entry.timestamp >= startTime);
    }

    if (endTime) {
      filteredLogs = filteredLogs.filter(entry => entry.timestamp <= endTime);
    }

    return filteredLogs.sort((a, b) => a.timestamp - b.timestamp);
  }
}

export const logger = new Logger();
