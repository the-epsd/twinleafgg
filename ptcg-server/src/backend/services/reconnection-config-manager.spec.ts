import { ReconnectionConfigManager, ResourceMetrics, ConfigUpdateEvent, ResourcePrioritizationRule } from './reconnection-config-manager';
import { ReconnectionConfig } from '../interfaces/reconnection.interface';
import { ReconnectionConfigValidator } from './reconnection-config-validator';

describe('ReconnectionConfigManager', () => {
  let configManager: ReconnectionConfigManager;
  let validConfig: ReconnectionConfig;

  beforeEach(() => {
    validConfig = ReconnectionConfigValidator.getDefaultConfig();
    configManager = new ReconnectionConfigManager(validConfig);
  });

  afterEach(() => {
    configManager.dispose();
  });

  describe('constructor', () => {
    it('should initialize with valid configuration', () => {
      expect(configManager.getCurrentConfig()).toEqual(validConfig);
    });

    it('should throw error for invalid initial configuration', () => {
      const invalidConfig = { ...validConfig, preservationTimeoutMs: -1000 };

      expect(() => new ReconnectionConfigManager(invalidConfig)).toThrow('Invalid initial configuration');
    });

    it('should set up default prioritization rules', () => {
      // Test that default rules are applied by triggering resource optimization
      const highMemoryMetrics: ResourceMetrics = {
        availableMemoryMB: 100,
        activeSessions: 100,
        cpuUsagePercent: 50,
        preservedSessions: 80, // High preserved sessions
        timestamp: Date.now()
      };

      configManager.updateResourceMetrics(highMemoryMetrics);
      const result = configManager.optimizeForResources();

      expect(result).toBeDefined();
      expect(result!.isValid).toBe(true);
    });
  });

  describe('getCurrentConfig', () => {
    it('should return a copy of the current configuration', () => {
      const config = configManager.getCurrentConfig();

      expect(config).toEqual(validConfig);
      expect(config).not.toBe(validConfig); // Should be a copy
    });
  });

  describe('updateConfig', () => {
    it('should update configuration with valid partial config', () => {
      const updates = {
        preservationTimeoutMs: 8 * 60 * 1000,
        maxAutoReconnectAttempts: 5
      };

      const result = configManager.updateConfig(updates);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);

      const updatedConfig = configManager.getCurrentConfig();
      expect(updatedConfig.preservationTimeoutMs).toBe(8 * 60 * 1000);
      expect(updatedConfig.maxAutoReconnectAttempts).toBe(5);
      expect(updatedConfig.reconnectIntervals).toEqual(validConfig.reconnectIntervals); // Unchanged
    });

    it('should reject invalid configuration updates', () => {
      const invalidUpdates = {
        preservationTimeoutMs: -1000
      };

      const result = configManager.updateConfig(invalidUpdates);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);

      // Configuration should remain unchanged
      expect(configManager.getCurrentConfig()).toEqual(validConfig);
    });

    it('should emit configUpdated event on successful update', (done) => {
      const updates = {
        preservationTimeoutMs: 8 * 60 * 1000
      };

      configManager.on('configUpdated', (event: ConfigUpdateEvent) => {
        expect(event.oldConfig).toEqual(validConfig);
        expect(event.newConfig.preservationTimeoutMs).toBe(8 * 60 * 1000);
        expect(event.source).toBe('runtime');
        expect(event.timestamp).toBeGreaterThan(0);
        done();
      });

      configManager.updateConfig(updates);
    });

    it('should not emit event on failed update', () => {
      const eventSpy = jasmine.createSpy('configUpdated');
      configManager.on('configUpdated', eventSpy);

      const invalidUpdates = {
        preservationTimeoutMs: -1000
      };

      configManager.updateConfig(invalidUpdates);

      expect(eventSpy).not.toHaveBeenCalled();
    });
  });

  describe('resetToOriginal', () => {
    it('should reset configuration to original values', () => {
      // First, update the configuration
      configManager.updateConfig({
        preservationTimeoutMs: 8 * 60 * 1000,
        maxAutoReconnectAttempts: 5
      });

      // Verify it was updated
      let currentConfig = configManager.getCurrentConfig();
      expect(currentConfig.preservationTimeoutMs).toBe(8 * 60 * 1000);

      // Reset to original
      configManager.resetToOriginal();

      // Verify it was reset
      currentConfig = configManager.getCurrentConfig();
      expect(currentConfig).toEqual(validConfig);
    });

    it('should emit configUpdated event with manual source', (done) => {
      // Update first
      configManager.updateConfig({ preservationTimeoutMs: 8 * 60 * 1000 });

      configManager.on('configUpdated', (event: ConfigUpdateEvent) => {
        if (event.source === 'manual') {
          expect(event.newConfig).toEqual(validConfig);
          done();
        }
      });

      configManager.resetToOriginal();
    });
  });

  describe('updateResourceMetrics', () => {
    it('should update resource metrics', () => {
      const metrics: Partial<ResourceMetrics> = {
        availableMemoryMB: 2048,
        activeSessions: 100,
        cpuUsagePercent: 60
      };

      configManager.updateResourceMetrics(metrics);

      const storedMetrics = configManager.getResourceMetrics();
      expect(storedMetrics).toBeDefined();
      expect(storedMetrics!.availableMemoryMB).toBe(2048);
      expect(storedMetrics!.activeSessions).toBe(100);
      expect(storedMetrics!.cpuUsagePercent).toBe(60);
      expect(storedMetrics!.timestamp).toBeGreaterThan(0);
    });

    it('should merge with existing metrics', () => {
      configManager.updateResourceMetrics({
        availableMemoryMB: 2048,
        activeSessions: 100
      });

      configManager.updateResourceMetrics({
        cpuUsagePercent: 75,
        preservedSessions: 20
      });

      const metrics = configManager.getResourceMetrics();
      expect(metrics!.availableMemoryMB).toBe(2048);
      expect(metrics!.activeSessions).toBe(100);
      expect(metrics!.cpuUsagePercent).toBe(75);
      expect(metrics!.preservedSessions).toBe(20);
    });
  });

  describe('addPrioritizationRule', () => {
    it('should add custom prioritization rule', () => {
      const customRule: ResourcePrioritizationRule = {
        condition: (metrics, config) => metrics.activeSessions > 500,
        adjustment: (config) => ({ maxAutoReconnectAttempts: 2 }),
        description: 'Custom high session rule',
        priority: 150
      };

      configManager.addPrioritizationRule(customRule);

      // Trigger the rule
      configManager.updateResourceMetrics({
        availableMemoryMB: 2048,
        activeSessions: 600, // Above threshold
        cpuUsagePercent: 50,
        preservedSessions: 10
      });

      const result = configManager.optimizeForResources();
      expect(result).toBeDefined();
      expect(result!.isValid).toBe(true);

      const config = configManager.getCurrentConfig();
      expect(config.maxAutoReconnectAttempts).toBe(2);
    });

    it('should sort rules by priority', () => {
      const lowPriorityRule: ResourcePrioritizationRule = {
        condition: () => true,
        adjustment: (config) => ({ maxAutoReconnectAttempts: 1 }),
        description: 'Low priority rule',
        priority: 50
      };

      const highPriorityRule: ResourcePrioritizationRule = {
        condition: () => true,
        adjustment: (config) => ({ maxAutoReconnectAttempts: 2 }),
        description: 'High priority rule',
        priority: 200
      };

      configManager.addPrioritizationRule(lowPriorityRule);
      configManager.addPrioritizationRule(highPriorityRule);

      configManager.updateResourceMetrics({
        availableMemoryMB: 2048,
        activeSessions: 100,
        cpuUsagePercent: 50,
        preservedSessions: 10
      });

      configManager.optimizeForResources();

      // High priority rule should override low priority rule
      const config = configManager.getCurrentConfig();
      expect(config.maxAutoReconnectAttempts).toBe(2);
    });
  });

  describe('removePrioritizationRule', () => {
    it('should remove prioritization rule by description', () => {
      const customRule: ResourcePrioritizationRule = {
        condition: () => true,
        adjustment: (config) => ({ maxAutoReconnectAttempts: 1 }),
        description: 'Test rule to remove',
        priority: 100
      };

      configManager.addPrioritizationRule(customRule);
      const removed = configManager.removePrioritizationRule('Test rule to remove');

      expect(removed).toBe(true);

      // Rule should no longer apply
      configManager.updateResourceMetrics({
        availableMemoryMB: 2048,
        activeSessions: 100,
        cpuUsagePercent: 50,
        preservedSessions: 10
      });

      configManager.optimizeForResources();
      const config = configManager.getCurrentConfig();
      expect(config.maxAutoReconnectAttempts).toBe(validConfig.maxAutoReconnectAttempts);
    });

    it('should return false when rule not found', () => {
      const removed = configManager.removePrioritizationRule('Non-existent rule');
      expect(removed).toBe(false);
    });
  });

  describe('optimizeForResources', () => {
    it('should return null when no metrics available', () => {
      const result = configManager.optimizeForResources();
      expect(result).toBeNull();
    });

    it('should apply high memory usage optimization', () => {
      const highMemoryMetrics: ResourceMetrics = {
        availableMemoryMB: 100,
        activeSessions: 100,
        cpuUsagePercent: 50,
        preservedSessions: 80, // High memory usage
        timestamp: Date.now()
      };

      configManager.updateResourceMetrics(highMemoryMetrics);
      const result = configManager.optimizeForResources();

      expect(result).toBeDefined();
      expect(result!.isValid).toBe(true);

      const config = configManager.getCurrentConfig();
      expect(config.preservationTimeoutMs).toBeLessThan(validConfig.preservationTimeoutMs);
    });

    it('should apply high CPU usage optimization', () => {
      const highCpuMetrics: ResourceMetrics = {
        availableMemoryMB: 2048,
        activeSessions: 100,
        cpuUsagePercent: 90, // High CPU usage
        preservedSessions: 10,
        timestamp: Date.now()
      };

      configManager.updateResourceMetrics(highCpuMetrics);
      const result = configManager.optimizeForResources();

      expect(result).toBeDefined();
      expect(result!.isValid).toBe(true);

      const config = configManager.getCurrentConfig();
      expect(config.healthCheckIntervalMs).toBeGreaterThan(validConfig.healthCheckIntervalMs);
      expect(config.maxAutoReconnectAttempts).toBeLessThan(validConfig.maxAutoReconnectAttempts);
    });

    it('should apply critical resource shortage optimization', () => {
      const criticalMetrics: ResourceMetrics = {
        availableMemoryMB: 100,
        activeSessions: 1000,
        cpuUsagePercent: 96, // Critical CPU usage
        preservedSessions: 95, // Critical memory usage
        timestamp: Date.now()
      };

      configManager.updateResourceMetrics(criticalMetrics);
      const result = configManager.optimizeForResources();

      expect(result).toBeDefined();
      expect(result!.isValid).toBe(true);

      const config = configManager.getCurrentConfig();
      expect(config.maxAutoReconnectAttempts).toBe(1);
      expect(config.maxPreservedSessionsPerUser).toBe(1);
      expect(config.preservationTimeoutMs).toBeLessThan(validConfig.preservationTimeoutMs);
    });

    it('should emit configUpdated event with resource-optimization source', (done) => {
      const highMemoryMetrics: ResourceMetrics = {
        availableMemoryMB: 100,
        activeSessions: 100,
        cpuUsagePercent: 50,
        preservedSessions: 80,
        timestamp: Date.now()
      };

      configManager.on('configUpdated', (event: ConfigUpdateEvent) => {
        expect(event.source).toBe('resource-optimization');
        expect(event.oldConfig).toEqual(validConfig);
        expect(event.newConfig).not.toEqual(validConfig);
        done();
      });

      configManager.updateResourceMetrics(highMemoryMetrics);
      configManager.optimizeForResources();
    });

    it('should respect optimization cooldown', () => {
      const highMemoryMetrics: ResourceMetrics = {
        availableMemoryMB: 100,
        activeSessions: 100,
        cpuUsagePercent: 50,
        preservedSessions: 80,
        timestamp: Date.now()
      };

      configManager.updateResourceMetrics(highMemoryMetrics);

      // First optimization should work
      const result1 = configManager.optimizeForResources();
      expect(result1).toBeDefined();
      expect(result1!.isValid).toBe(true);

      // Immediate second optimization should be skipped due to cooldown
      // We need to check the internal state since the method will still return a result
      // but won't actually change the configuration
      const configAfterFirst = configManager.getCurrentConfig();

      configManager.optimizeForResources();
      const configAfterSecond = configManager.getCurrentConfig();

      expect(configAfterFirst).toEqual(configAfterSecond);
    });
  });

  describe('getResourceMetrics', () => {
    it('should return null when no metrics set', () => {
      const metrics = configManager.getResourceMetrics();
      expect(metrics).toBeNull();
    });

    it('should return copy of metrics when available', () => {
      const originalMetrics: Partial<ResourceMetrics> = {
        availableMemoryMB: 2048,
        activeSessions: 100,
        cpuUsagePercent: 60
      };

      configManager.updateResourceMetrics(originalMetrics);
      const retrievedMetrics = configManager.getResourceMetrics();

      expect(retrievedMetrics).toBeDefined();
      expect(retrievedMetrics!.availableMemoryMB).toBe(2048);
      // Should be a copy - we can't directly test this without accessing internals
      // but we can verify the values are correct
      expect(retrievedMetrics!.cpuUsagePercent).toBe(60);
    });
  });

  describe('dispose', () => {
    it('should clean up resources and remove listeners', () => {
      const eventSpy = jasmine.createSpy('configUpdated');
      configManager.on('configUpdated', eventSpy);

      configManager.dispose();

      // Try to trigger an event - should not call the spy
      configManager.updateConfig({ preservationTimeoutMs: 8 * 60 * 1000 });
      expect(eventSpy).not.toHaveBeenCalled();
    });

    it('should clear intervals', () => {
      spyOn(global, 'clearInterval');

      configManager.dispose();

      expect(clearInterval).toHaveBeenCalled();
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple configuration updates and optimizations', () => {
      // Initial update
      configManager.updateConfig({
        preservationTimeoutMs: 8 * 60 * 1000,
        maxAutoReconnectAttempts: 5
      });

      let config = configManager.getCurrentConfig();
      expect(config.preservationTimeoutMs).toBe(8 * 60 * 1000);
      expect(config.maxAutoReconnectAttempts).toBe(5);

      // Resource-based optimization
      configManager.updateResourceMetrics({
        availableMemoryMB: 100,
        activeSessions: 100,
        cpuUsagePercent: 90,
        preservedSessions: 80
      });

      configManager.optimizeForResources();

      config = configManager.getCurrentConfig();
      expect(config.preservationTimeoutMs).toBeLessThan(8 * 60 * 1000);
      expect(config.maxAutoReconnectAttempts).toBeLessThan(5);

      // Reset to original
      configManager.resetToOriginal();

      config = configManager.getCurrentConfig();
      expect(config).toEqual(validConfig);
    });

    it('should handle rapid resource metric updates', () => {
      const eventSpy = jasmine.createSpy('configUpdated');
      configManager.on('configUpdated', eventSpy);

      // Rapid updates that should trigger optimization
      for (let i = 0; i < 5; i++) {
        configManager.updateResourceMetrics({
          availableMemoryMB: 100 - i * 10,
          activeSessions: 100 + i * 50,
          cpuUsagePercent: 85 + i,
          preservedSessions: 80 + i * 5
        });
      }

      // Should only optimize once due to cooldown
      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        source: 'resource-optimization'
      }));
    });
  });
});