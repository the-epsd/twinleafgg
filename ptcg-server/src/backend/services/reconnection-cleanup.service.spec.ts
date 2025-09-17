import { ReconnectionCleanupService, MaintenanceConfig } from './reconnection-cleanup.service';
import { GameStatePreserver } from './game-state-preserver';
import { ReconnectionConfigManager } from './reconnection-config-manager';
import { DisconnectedSession } from '../../storage/model/disconnected-session';

describe('ReconnectionCleanupService', () => {
  let cleanupService: ReconnectionCleanupService;
  let mockGameStatePreserver: GameStatePreserver;
  let mockConfigManager: ReconnectionConfigManager;

  const mockConfig: MaintenanceConfig = {
    cleanupIntervalMs: 5000,
    databaseOptimizationIntervalMs: 10000,
    memoryCleanupThresholdMb: 50,
    maxSessionAge: 60000,
    enableScheduledCleanup: true,
    enableDatabaseOptimization: true,
    enableMemoryManagement: true
  };

  beforeEach(() => {
    // Create mock objects
    mockGameStatePreserver = jasmine.createSpyObj('GameStatePreserver', [
      'cleanupExpiredSessions',
      'removePreservedState',
      'updateConfig',
      'getConfig'
    ]);
    (mockGameStatePreserver.cleanupExpiredSessions as jasmine.Spy).and.returnValue(Promise.resolve(5));
    (mockGameStatePreserver.removePreservedState as jasmine.Spy).and.returnValue(Promise.resolve());
    (mockGameStatePreserver.getConfig as jasmine.Spy).and.returnValue({});

    mockConfigManager = jasmine.createSpyObj('ReconnectionConfigManager', [
      'getCurrentConfig',
      'updateConfig',
      'on',
      'dispose'
    ]);
    (mockConfigManager.getCurrentConfig as jasmine.Spy).and.returnValue({});

    cleanupService = new ReconnectionCleanupService(
      mockGameStatePreserver,
      mockConfigManager,
      mockConfig
    );
  });

  describe('constructor', () => {
    it('should initialize with provided configuration', () => {
      const config = cleanupService.getConfig();
      expect(config.cleanupIntervalMs).toBe(5000);
      expect(config.enableScheduledCleanup).toBe(true);
    });

    it('should initialize with default configuration when no config provided', () => {
      const service = new ReconnectionCleanupService(
        mockGameStatePreserver,
        mockConfigManager
      );

      const config = service.getConfig();
      expect(config.cleanupIntervalMs).toBe(5 * 60 * 1000); // 5 minutes default
      expect(config.enableScheduledCleanup).toBe(true);
    });
  });

  describe('cleanupOrphanedGameStates', () => {
    it('should delegate to GameStatePreserver', async () => {
      const result = await cleanupService.cleanupOrphanedGameStates();

      expect(result).toBe(5);
      expect(mockGameStatePreserver.cleanupExpiredSessions).toHaveBeenCalled();
    });

    it('should handle errors from GameStatePreserver', async () => {
      (mockGameStatePreserver.cleanupExpiredSessions as jasmine.Spy).and.returnValue(
        Promise.reject(new Error('Preserver error'))
      );

      const result = await cleanupService.cleanupOrphanedGameStates();

      expect(result).toBe(0);
    });
  });

  describe('performMemoryCleanup', () => {
    it('should return 0 when memory management is disabled', async () => {
      cleanupService.updateConfig({ enableMemoryManagement: false });

      const result = await cleanupService.performMemoryCleanup();

      expect(result).toBe(0);
    });

    it('should return 0 when memory usage is below threshold', async () => {
      // Mock process.memoryUsage to return low memory usage
      const originalMemoryUsage = process.memoryUsage;
      process.memoryUsage = jasmine.createSpy('memoryUsage').and.returnValue({
        heapUsed: 30 * 1024 * 1024, // 30MB - below 50MB threshold
        rss: 0,
        external: 0,
        heapTotal: 0,
        arrayBuffers: 0
      });

      const result = await cleanupService.performMemoryCleanup();

      expect(result).toBe(0);

      // Restore original function
      process.memoryUsage = originalMemoryUsage;
    });
  });

  describe('metrics and configuration', () => {
    it('should return current metrics', () => {
      const metrics = cleanupService.getMetrics();

      expect(metrics).toBeDefined();
      expect(typeof metrics.expiredSessionsRemoved).toBe('number');
      expect(typeof metrics.orphanedStatesRemoved).toBe('number');
      expect(typeof metrics.totalCleanupOperations).toBe('number');
    });

    it('should reset metrics', () => {
      cleanupService.resetMetrics();

      const metrics = cleanupService.getMetrics();
      expect(metrics.expiredSessionsRemoved).toBe(0);
      expect(metrics.totalCleanupOperations).toBe(0);
    });

    it('should update configuration', () => {
      const newConfig: Partial<MaintenanceConfig> = {
        cleanupIntervalMs: 15000,
        enableScheduledCleanup: false
      };

      cleanupService.updateConfig(newConfig);

      const config = cleanupService.getConfig();
      expect(config.cleanupIntervalMs).toBe(15000);
      expect(config.enableScheduledCleanup).toBe(false);
    });

    it('should return health status', () => {
      const health = cleanupService.getHealthStatus();

      expect(health).toBeDefined();
      expect(typeof health.isHealthy).toBe('boolean');
      expect(typeof health.lastCleanupAge).toBe('number');
      expect(typeof health.activeOperations).toBe('number');
      expect(typeof health.isShuttingDown).toBe('boolean');
      expect(health.metrics).toBeDefined();
    });
  });

  describe('gracefulShutdown', () => {
    it('should complete without errors', async () => {
      try {
        await cleanupService.gracefulShutdown();
        expect(true).toBe(true); // Test passes if no error is thrown
      } catch (error) {
        fail('gracefulShutdown should not throw an error');
      }
    });

    it('should set isShuttingDown flag', async () => {
      await cleanupService.gracefulShutdown();

      const health = cleanupService.getHealthStatus();
      expect(health.isShuttingDown).toBe(true);
    });
  });

  describe('forceCleanupUserSessions', () => {
    beforeEach(() => {
      // Mock DisconnectedSession.find
      spyOn(DisconnectedSession, 'find')
        .and.returnValue(Promise.resolve([]));
    });

    it('should return 0 when no sessions found', async () => {
      const result = await cleanupService.forceCleanupUserSessions(1);

      expect(result).toBe(0);
    });

    it('should handle database errors gracefully', async () => {
      spyOn(DisconnectedSession, 'find')
        .and.returnValue(Promise.reject(new Error('Database error')));

      const result = await cleanupService.forceCleanupUserSessions(1);

      expect(result).toBe(0);
    });
  });
});