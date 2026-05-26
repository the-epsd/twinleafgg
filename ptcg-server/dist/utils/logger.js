import { config } from '../config';
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
export class Logger {
    constructor() {
        this.logBuffer = [];
        this.maxBufferSize = 1000;
    }
    log(message) {
        if (!config.core.debug) {
            return;
        }
        console.log(message);
    }
    logStructured(entry) {
        var _a, _b, _c;
        const logEntry = Object.assign({ timestamp: Date.now(), level: (_a = entry.level) !== null && _a !== void 0 ? _a : LogLevel.INFO, category: (_b = entry.category) !== null && _b !== void 0 ? _b : 'general', message: (_c = entry.message) !== null && _c !== void 0 ? _c : '' }, entry);
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
    getRecentLogs(category, level, limit = 100) {
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
    getLogSummary() {
        const summary = {};
        for (const entry of this.logBuffer) {
            if (!summary[entry.category]) {
                summary[entry.category] = {};
            }
            const levelStr = LogLevel[entry.level];
            summary[entry.category][levelStr] = (summary[entry.category][levelStr] || 0) + 1;
        }
        return summary;
    }
    exportLogs(category, startTime, endTime) {
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
