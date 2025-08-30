import { Logger, LogLevel, LogEntry } from './logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
    logger.resetMetrics();
  });

  describe('Basic Logging', () => {
    it('should log structured entries', () => {
      const entry: Partial<LogEntry> = {
        level: LogLevel.INFO,
        category: 'test',
        message: 'Test message',
        userId: 123,
        gameId: 456,
        data: { key: 'value' }
      };

      logger.logStructured(entry);

      const recentLogs = logger.getRecentLogs('test', undefined, 1);
      expect(recentLogs.length).toBe(1);
      expect(recentLogs[0].message).toBe('Test message');
      expect(recentLogs[0].userId).toBe(123);
      expect(recentLogs[0].gameId).toBe(456);
      expect(recentLogs[0].data).toEqual({ key: 'value' });
    });

    it('should apply default values for missing fields', () => {
      logger.logStructured({ message: 'Test' });

      const recentLogs = logger.getRecentLogs(undefined, undefined, 1);
      expect(recentLogs[0].level).toBe(LogLevel.INFO);
      expect(recentLogs[0].category).toBe('general');
      expect(recentLogs[0].timestamp).toBeDefined();
    });

    it('should maintain log buffer with size limit', () => {
      // Create more logs than the buffer size (1000)
      for (let i = 0; i < 1100; i++) {
        logger.logStructured({ message: `Message ${i}` });
      }

      const allLogs = logger.getRecentLogs();
      expect(allLogs.length).toBe(1000);

      // Should contain the most recent logs
      expect(allLogs[0].message).toBe('Message 1099');
      expect(allLogs[999].message).toBe('Message 100');
    });
  });

  describe('Reconnection-specific Logging', () => {
    it('should log disconnection events and update metrics', () => {
      logger.logDisconnection(123, 456, 'network_error', 'session-123');

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.totalDisconnections).toBe(1);

      const logs = logger.getRecentLogs('reconnection');
      expect(logs.length).toBe(1);
      expect(logs[0].message).toBe('Player disconnected');
      expect(logs[0].userId).toBe(123);
      expect(logs[0].gameId).toBe(456);
      expect(logs[0].data.reason).toBe('network_error');
    });

    it('should log reconnection attempts and update metrics', () => {
      logger.logReconnectionAttempt(123, 456, 1, 'session-123');

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.totalReconnectionAttempts).toBe(1);

      const logs = logger.getRecentLogs('reconnection');
      expect(logs.length).toBe(1);
      expect(logs[0].message).toBe('Reconnection attempt started');
    });

    it('should log successful reconnections and update metrics', () => {
      const reconnectionTime = 5000;
      logger.logReconnectionSuccess(123, 456, reconnectionTime, 'session-123');

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.successfulReconnections).toBe(1);
      expect(metrics.averageReconnectionTime).toBe(reconnectionTime);

      const logs = logger.getRecentLogs('reconnection');
      expect(logs.length).toBe(1);
      expect(logs[0].message).toBe('Reconnection successful');
      expect(logs[0].data.reconnectionTimeMs).toBe(reconnectionTime);
    });

    it('should calculate average reconnection time correctly', () => {
      logger.logReconnectionSuccess(123, 456, 1000, 'session-1');
      logger.logReconnectionSuccess(124, 457, 2000, 'session-2');
      logger.logReconnectionSuccess(125, 458, 3000, 'session-3');

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.averageReconnectionTime).toBe(2000);
    });

    it('should log failed reconnections and update metrics', () => {
      const error = new Error('Connection timeout');
      logger.logReconnectionFailure(123, 456, 'timeout', 'session-123', error);

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.failedReconnections).toBe(1);
      expect(metrics.errorCount).toBe(1);

      const logs = logger.getRecentLogs('reconnection');
      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe(LogLevel.ERROR);
      expect(logs[0].message).toBe('Reconnection failed');
      expect(logs[0].error).toBe(error);
    });

    it('should log session expiry events', () => {
      logger.logSessionExpiry(123, 456, 'session-123');

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.expiredSessions).toBe(1);

      const logs = logger.getRecentLogs('session-management');
      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe(LogLevel.WARN);
      expect(logs[0].message).toBe('Disconnected session expired');
    });
  });

  describe('State Preservation Logging', () => {
    it('should log successful state preservation', () => {
      logger.logStatePreservation(123, 456, true, 'session-123');

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.preservedStatesCount).toBe(1);

      const logs = logger.getRecentLogs('state-preservation');
      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe(LogLevel.INFO);
      expect(logs[0].message).toBe('Game state preserved successfully');
    });

    it('should log failed state preservation', () => {
      const error = new Error('Serialization failed');
      logger.logStatePreservation(123, 456, false, 'session-123', error);

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.errorCount).toBe(1);

      const logs = logger.getRecentLogs('state-preservation');
      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe(LogLevel.ERROR);
      expect(logs[0].message).toBe('Failed to preserve game state');
      expect(logs[0].error).toBe(error);
    });

    it('should log state restoration events', () => {
      logger.logStateRestoration(123, 456, true, 'session-123');

      const logs = logger.getRecentLogs('state-restoration');
      expect(logs.length).toBe(1);
      expect(logs[0].message).toBe('Game state restored successfully');

      const error = new Error('Deserialization failed');
      logger.logStateRestoration(124, 457, false, 'session-124', error);

      const errorLogs = logger.getRecentLogs('state-restoration', LogLevel.ERROR);
      expect(errorLogs.length).toBe(1);
      expect(errorLogs[0].message).toBe('Failed to restore game state');
    });
  });

  describe('Cleanup and Monitoring Logging', () => {
    it('should log cleanup operations', () => {
      logger.logCleanupOperation('expired-sessions', 5, 1500);

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.cleanupOperations).toBe(1);

      const logs = logger.getRecentLogs('cleanup');
      expect(logs.length).toBe(1);
      expect(logs[0].message).toBe('Cleanup operation completed: expired-sessions');
      expect(logs[0].data.itemsProcessed).toBe(5);
      expect(logs[0].data.durationMs).toBe(1500);
    });

    it('should log connection quality changes', () => {
      const metrics = { averageLatency: 150, packetLoss: 0.02 };
      logger.logConnectionQualityChange(123, 'excellent', 'good', metrics);

      const logs = logger.getRecentLogs('connection-monitor');
      expect(logs.length).toBe(1);
      expect(logs[0].message).toBe('Connection quality changed');
      expect(logs[0].data.previousQuality).toBe('excellent');
      expect(logs[0].data.currentQuality).toBe('good');
    });

    it('should log automatic reconnection attempts', () => {
      logger.logAutomaticReconnectionAttempt(123, 2, 3, 10000);

      const logs = logger.getRecentLogs('auto-reconnection');
      expect(logs.length).toBe(1);
      expect(logs[0].message).toBe('Automatic reconnection attempt');
      expect(logs[0].data.attemptNumber).toBe(2);
      expect(logs[0].data.maxAttempts).toBe(3);
      expect(logs[0].data.nextAttemptIn).toBe(10000);
    });
  });

  describe('Metrics and Filtering', () => {
    beforeEach(() => {
      // Create test data
      logger.logDisconnection(123, 456, 'network_error');
      logger.logReconnectionAttempt(123, 456, 1);
      logger.logReconnectionSuccess(123, 456, 2000);
      logger.logStatePreservation(123, 456, true);
      logger.logCleanupOperation('test', 1, 100);
    });

    it('should get metrics correctly', () => {
      const metrics = logger.getReconnectionMetrics();
      expect(metrics.totalDisconnections).toBe(1);
      expect(metrics.totalReconnectionAttempts).toBe(1);
      expect(metrics.successfulReconnections).toBe(1);
      expect(metrics.preservedStatesCount).toBe(1);
      expect(metrics.cleanupOperations).toBe(1);
      expect(metrics.averageReconnectionTime).toBe(2000);
    });

    it('should filter logs by category', () => {
      const reconnectionLogs = logger.getRecentLogs('reconnection');
      expect(reconnectionLogs.length).toBeGreaterThan(0);

      for (const log of reconnectionLogs) {
        expect(log.category).toBe('reconnection');
      }
    });

    it('should filter logs by level', () => {
      logger.logReconnectionFailure(124, 457, 'error', 'session-124');

      const errorLogs = logger.getRecentLogs(undefined, LogLevel.ERROR);
      expect(errorLogs.length).toBeGreaterThan(0);

      for (const log of errorLogs) {
        expect(log.level).toBeGreaterThanOrEqual(LogLevel.ERROR);
      }
    });

    it('should export logs for time range', () => {
      const startTime = Date.now() - 1000;
      const endTime = Date.now() + 1000;

      const logs = logger.exportLogs(undefined, startTime, endTime);
      expect(logs.length).toBeGreaterThan(0);

      for (const log of logs) {
        expect(log.timestamp).toBeGreaterThanOrEqual(startTime);
        expect(log.timestamp).toBeLessThanOrEqual(endTime);
      }
    });

    it('should get log summary by category and level', () => {
      const summary = logger.getLogSummary();
      expect(summary.reconnection).toBeDefined();
      expect(summary['state-preservation']).toBeDefined();
      expect(summary.cleanup).toBeDefined();

      expect(summary.reconnection.INFO).toBeGreaterThan(0);
    });

    it('should reset metrics correctly', () => {
      const beforeReset = logger.getReconnectionMetrics();
      expect(beforeReset.totalDisconnections).toBeGreaterThan(0);

      logger.resetMetrics();

      const afterReset = logger.getReconnectionMetrics();
      expect(afterReset.totalDisconnections).toBe(0);
      expect(afterReset.totalReconnectionAttempts).toBe(0);
      expect(afterReset.successfulReconnections).toBe(0);
      expect(afterReset.lastResetTime).toBeGreaterThan(beforeReset.lastResetTime);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty reconnection times array', () => {
      const metrics = logger.getReconnectionMetrics();
      expect(metrics.averageReconnectionTime).toBe(0);
    });

    it('should maintain only last 100 reconnection times', () => {
      // Add 150 reconnection times
      for (let i = 1; i <= 150; i++) {
        logger.logReconnectionSuccess(i, i, i * 100);
      }

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.successfulReconnections).toBe(150);

      // Average should be calculated from last 100 entries (51-150)
      // Sum of 51-150 * 100 = (51+150)*100/2 * 100 = 1005000
      // Average = 1005000 / 100 = 10050
      expect(metrics.averageReconnectionTime).toBe(10050);
    });

    it('should handle logs with missing data gracefully', () => {
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'test',
        message: 'Test without data'
      });

      const logs = logger.getRecentLogs('test');
      expect(logs.length).toBe(1);
      expect(logs[0].data).toBeUndefined();
    });

    it('should handle export with no matching logs', () => {
      const logs = logger.exportLogs('nonexistent-category');
      expect(logs.length).toBe(0);
    });
  });
});