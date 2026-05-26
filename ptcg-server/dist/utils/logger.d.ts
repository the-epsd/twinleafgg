export declare enum LogLevel {
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
export declare class Logger {
    private logBuffer;
    private maxBufferSize;
    log(message: string): void;
    logStructured(entry: Partial<LogEntry>): void;
    getRecentLogs(category?: string, level?: LogLevel, limit?: number): LogEntry[];
    getLogSummary(): {
        [category: string]: {
            [level: string]: number;
        };
    };
    exportLogs(category?: string, startTime?: number, endTime?: number): LogEntry[];
}
export declare const logger: Logger;
