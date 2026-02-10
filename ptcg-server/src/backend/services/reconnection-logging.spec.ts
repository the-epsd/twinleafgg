import { logger, LogLevel } from '../../utils/logger';
import { ReconnectionManager } from './reconnection-manager';
import { ReconnectionConfig } from '../interfaces/reconnection.interface';

describe('Reconnection System Logging', () => {
  let reconnectionManager: ReconnectionManager;

  const defaultConfig: ReconnectionConfig = {
    preservationTimeoutMs: 300000,
    maxAutoReconnectAttempts: 3,
    reconnectIntervals: [5000, 10000, 15000],
    healthCheckIntervalMs: 30000,
    cleanupIntervalMs: 60000,
    maxPreservedSessionsPerUser: 1,
    disconnectForfeitMs: 60 * 1000
  };

  beforeEach(() => {
    logger.resetMetrics();

    reconnectionManager = new ReconnectionManager(defaultConfig);
  });

  afterEach(() => {
    reconnectionManager.dispose();
  });

  describe('Logger Functionality', () => {
    it('should log disconnection events correctly', () => {
      logger.logDisconnection(123, 456, 'network_error', 'session-123');

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.totalDisconnections).toBe(1);

      const logs = logger.getRecentLogs('reconnection');
      expect(logs.length).toBeGreaterThan(0);

      const disconnectionLog = logs.find(log => log.message === 'Player disconnected');
      expect(disconnectionLog).toBeDefined();
      expect(disconnectionLog?.userId).toBe(123);
      expect(disconnectionLog?.gameId).toBe(456);
    });

    it('should log reconnection attempts and track metrics', () => {
      logger.logReconnectionAttempt(123, 456, 1, 'session-123');
      logger.logReconnectionSuccess(123, 456, 2000, 'session-123');

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.totalReconnectionAttempts).toBe(1);
      expect(metrics.successfulReconnections).toBe(1);
      expect(metrics.averageReconnectionTime).toBe(2000);

      const logs = logger.getRecentLogs('reconnection');
      expect(logs.length).toBeGreaterThan(0);
    });

    it('should log state preservation events', () => {
      logger.logStatePreservation(123, 456, true, 'session-123');

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.preservedStatesCount).toBe(1);

      const logs = logger.getRecentLogs('state-preservation');
      expect(logs.length).toBeGreaterThan(0);

      const preservationLog = logs.find(log => log.message === 'Game state preserved successfully');
      expect(preservationLog).toBeDefined();
    });

    it('should log errors and track error count', () => {
      const error = new Error('Test error');
      logger.logReconnectionFailure(123, 456, 'timeout', 'session-123', error);

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.failedReconnections).toBe(1);
      expect(metrics.errorCount).toBe(1);

      const errorLogs = logger.getRecentLogs(undefined, LogLevel.ERROR);
      expect(errorLogs.length).toBeGreaterThan(0);

      const errorLog = errorLogs.find(log => log.message === 'Reconnection failed');
      expect(errorLog).toBeDefined();
      expect(errorLog?.error).toBe(error);
    });

    it('should log cleanup operations', () => {
      logger.logCleanupOperation('expired-sessions', 5, 1500);

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.cleanupOperations).toBe(1);

      const logs = logger.getRecentLogs('cleanup');
      expect(logs.length).toBeGreaterThan(0);

      const cleanupLog = logs.find(log => log.message.includes('Cleanup operation completed'));
      expect(cleanupLog).toBeDefined();
      expect(cleanupLog?.data.itemsProcessed).toBe(5);
      expect(cleanupLog?.data.durationMs).toBe(1500);
    });

    it('should filter logs by category', () => {
      logger.logDisconnection(123, 456, 'network_error');
      logger.logStatePreservation(123, 456, true);
      logger.logCleanupOperation('test', 1, 100);

      const reconnectionLogs = logger.getRecentLogs('reconnection');
      const preservationLogs = logger.getRecentLogs('state-preservation');
      const cleanupLogs = logger.getRecentLogs('cleanup');

      expect(reconnectionLogs.length).toBeGreaterThan(0);
      expect(preservationLogs.length).toBeGreaterThan(0);
      expect(cleanupLogs.length).toBeGreaterThan(0);

      // Verify category filtering
      for (const log of reconnectionLogs) {
        expect(log.category).toBe('reconnection');
      }
    });

    it('should filter logs by level', () => {
      logger.logDisconnection(123, 456, 'network_error'); // INFO level
      logger.logReconnectionFailure(124, 457, 'error'); // ERROR level

      const allLogs = logger.getRecentLogs();
      const errorLogs = logger.getRecentLogs(undefined, LogLevel.ERROR);

      expect(allLogs.length).toBeGreaterThan(errorLogs.length);

      for (const log of errorLogs) {
        expect(log.level).toBeGreaterThanOrEqual(LogLevel.ERROR);
      }
    });

    it('should export logs for time range', () => {
      const startTime = Date.now() - 1000;
      logger.logDisconnection(123, 456, 'network_error');
      const endTime = Date.now() + 1000;

      const logs = logger.exportLogs(undefined, startTime, endTime);
      expect(logs.length).toBeGreaterThan(0);

      for (const log of logs) {
        expect(log.timestamp).toBeGreaterThanOrEqual(startTime);
        expect(log.timestamp).toBeLessThanOrEqual(endTime);
      }
    });

    it('should calculate average reconnection time correctly', () => {
      logger.logReconnectionSuccess(123, 456, 1000);
      logger.logReconnectionSuccess(124, 457, 2000);
      logger.logReconnectionSuccess(125, 458, 3000);

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.averageReconnectionTime).toBe(2000);
    });

    it('should reset metrics correctly', () => {
      logger.logDisconnection(123, 456, 'network_error');
      logger.logReconnectionSuccess(123, 456, 1000);

      const beforeReset = logger.getReconnectionMetrics();
      expect(beforeReset.totalDisconnections).toBe(1);
      expect(beforeReset.successfulReconnections).toBe(1);

      logger.resetMetrics();

      const afterReset = logger.getReconnectionMetrics();
      expect(afterReset.totalDisconnections).toBe(0);
      expect(afterReset.successfulReconnections).toBe(0);
      expect(afterReset.lastResetTime).toBeGreaterThan(beforeReset.lastResetTime);
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
    });

    it('should get log summary by category and level', () => {
      logger.logDisconnection(123, 456, 'network_error');
      logger.logReconnectionFailure(124, 457, 'timeout');
      logger.logStatePreservation(125, 458, true);

      const summary = logger.getLogSummary();
      expect(summary.reconnection).toBeDefined();
      expect(summary['state-preservation']).toBeDefined();

      expect(summary.reconnection.INFO).toBeGreaterThan(0);
      expect(summary.reconnection.ERROR).toBeGreaterThan(0);
    });
  });

  describe('Structured Logging', () => {
    it('should log structured entries with all fields', () => {
      const entry = {
        level: LogLevel.INFO,
        category: 'test',
        message: 'Test message',
        userId: 123,
        gameId: 456,
        sessionId: 'session-123',
        data: { key: 'value' }
      };

      logger.logStructured(entry);

      const logs = logger.getRecentLogs('test');
      expect(logs.length).toBe(1);

      const log = logs[0];
      expect(log.message).toBe('Test message');
      expect(log.userId).toBe(123);
      expect(log.gameId).toBe(456);
      expect(log.sessionId).toBe('session-123');
      expect(log.data).toEqual({ key: 'value' });
    });

    it('should apply default values for missing fields', () => {
      logger.logStructured({ message: 'Test' });

      const logs = logger.getRecentLogs();
      expect(logs.length).toBe(1);

      const log = logs[0];
      expect(log.level).toBe(LogLevel.INFO);
      expect(log.category).toBe('general');
      expect(log.timestamp).toBeDefined();
    });

    it('should handle logs with errors', () => {
      const error = new Error('Test error');
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'test',
        message: 'Error occurred',
        error
      });

      const logs = logger.getRecentLogs('test', LogLevel.ERROR);
      expect(logs.length).toBe(1);
      expect(logs[0].error).toBe(error);
    });
  });

  describe('Connection Quality Logging', () => {
    it('should log connection quality changes', () => {
      const metrics = { averageLatency: 150, packetLoss: 0.02 };
      logger.logConnectionQualityChange(123, 'excellent', 'good', metrics);

      const logs = logger.getRecentLogs('connection-monitor');
      expect(logs.length).toBe(1);

      const log = logs[0];
      expect(log.message).toBe('Connection quality changed');
      expect(log.userId).toBe(123);
      expect(log.data.previousQuality).toBe('excellent');
      expect(log.data.currentQuality).toBe('good');
      expect(log.data.metrics).toEqual(metrics);
    });

    it('should log automatic reconnection attempts', () => {
      logger.logAutomaticReconnectionAttempt(123, 2, 3, 10000);

      const logs = logger.getRecentLogs('auto-reconnection');
      expect(logs.length).toBe(1);

      const log = logs[0];
      expect(log.message).toBe('Automatic reconnection attempt');
      expect(log.userId).toBe(123);
      expect(log.data.attemptNumber).toBe(2);
      expect(log.data.maxAttempts).toBe(3);
      expect(log.data.nextAttemptIn).toBe(10000);
    });
  });

  describe('Session Management Logging', () => {
    it('should log session expiry events', () => {
      logger.logSessionExpiry(123, 456, 'session-123');

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.expiredSessions).toBe(1);

      const logs = logger.getRecentLogs('session-management');
      expect(logs.length).toBe(1);

      const log = logs[0];
      expect(log.level).toBe(LogLevel.WARN);
      expect(log.message).toBe('Disconnected session expired');
      expect(log.userId).toBe(123);
      expect(log.gameId).toBe(456);
    });
  });

  describe('Performance Tracking', () => {
    it('should track processing times in logs', () => {
      logger.logStructured({
        level: LogLevel.INFO,
        category: 'performance',
        message: 'Operation completed',
        data: { processingTimeMs: 150 }
      });

      const logs = logger.getRecentLogs('performance');
      expect(logs.length).toBe(1);
      expect(logs[0].data.processingTimeMs).toBe(150);
    });

    it('should maintain reconnection time history for averages', () => {
      // Add multiple reconnection times
      for (let i = 1; i <= 5; i++) {
        logger.logReconnectionSuccess(i, i, i * 1000);
      }

      const metrics = logger.getReconnectionMetrics();
      expect(metrics.successfulReconnections).toBe(5);
      expect(metrics.averageReconnectionTime).toBe(3000); // Average of 1000, 2000, 3000, 4000, 5000
    });
  });
});