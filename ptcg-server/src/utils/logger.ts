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

export class Logger {
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
