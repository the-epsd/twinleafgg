import { ReconnectionConfig } from '../interfaces/reconnection.interface';
import { ReconnectionConfigValidator, ConfigValidationResult, ConfigValidationOptions } from './reconnection-config-validator';
import { logger, LogLevel } from '../../utils/logger';
import { EventEmitter } from 'events';

export interface ResourceMetrics {
  availableMemoryMB: number;
  activeSessions: number;
  cpuUsagePercent: number;
  preservedSessions: number;
  timestamp: number;
}

export interface ConfigUpdateEvent {
  oldConfig: ReconnectionConfig;
  newConfig: ReconnectionConfig;
  timestamp: number;
  source: 'runtime' | 'resource-optimization' | 'manual';
}

export interface ResourcePrioritizationRule {
  condition: (metrics: ResourceMetrics, config: ReconnectionConfig) => boolean;
  adjustment: (config: ReconnectionConfig) => Partial<ReconnectionConfig>;
  description: string;
  priority: number; // Higher number = higher priority
}

export class ReconnectionConfigManager extends EventEmitter {
  private currentConfig: ReconnectionConfig;
  private originalConfig: ReconnectionConfig;
  private resourceMetrics: ResourceMetrics | null = null;
  private prioritizationRules: ResourcePrioritizationRule[] = [];
  private metricsUpdateInterval: NodeJS.Timeout | null = null;
  private lastResourceOptimization: number = 0;
  private readonly RESOURCE_OPTIMIZATION_COOLDOWN = 30 * 1000; // 30 seconds

  constructor(initialConfig: ReconnectionConfig) {
    super();

    // Validate initial configuration
    const validation = ReconnectionConfigValidator.validateConfig(initialConfig);
    if (!validation.isValid) {
      throw new Error(`Invalid initial configuration: ${validation.errors.join(', ')}`);
    }

    this.currentConfig = { ...initialConfig };
    this.originalConfig = { ...initialConfig };

    this.setupDefaultPrioritizationRules();
    this.startResourceMonitoring();

    logger.logStructured({
      level: LogLevel.INFO,
      message: 'ReconnectionConfigManager initialized',
      data: { config: this.currentConfig }
    });
  }

  /**
   * Get the current configuration
   */
  public getCurrentConfig(): ReconnectionConfig {
    return { ...this.currentConfig };
  }

  /**
   * Update configuration at runtime
   */
  public updateConfig(
    partialConfig: Partial<ReconnectionConfig>,
    options: ConfigValidationOptions = {}
  ): ConfigValidationResult {
    const oldConfig = { ...this.currentConfig };
    const { config: newConfig, validation } = ReconnectionConfigValidator.mergeAndValidateConfig(
      { ...this.currentConfig, ...partialConfig },
      options
    );

    if (!validation.isValid) {
      logger.logStructured({
        level: LogLevel.ERROR,
        message: 'Configuration update failed validation',
        data: {
          errors: validation.errors,
          warnings: validation.warnings,
          attemptedConfig: partialConfig
        }
      });
      return validation;
    }

    // Apply the new configuration
    this.currentConfig = newConfig;

    // Emit configuration change event
    const updateEvent: ConfigUpdateEvent = {
      oldConfig,
      newConfig,
      timestamp: Date.now(),
      source: 'runtime'
    };

    this.emit('configUpdated', updateEvent);

    logger.logStructured({
      level: LogLevel.INFO,
      message: 'Configuration updated successfully',
      data: {
        changes: this.getConfigDifferences(oldConfig, newConfig),
        warnings: validation.warnings
      }
    });

    return validation;
  }

  /**
   * Reset configuration to original values
   */
  public resetToOriginal(): void {
    const oldConfig = { ...this.currentConfig };
    this.currentConfig = { ...this.originalConfig };

    const updateEvent: ConfigUpdateEvent = {
      oldConfig,
      newConfig: this.currentConfig,
      timestamp: Date.now(),
      source: 'manual'
    };

    this.emit('configUpdated', updateEvent);

    logger.logStructured({
      level: LogLevel.INFO,
      message: 'Configuration reset to original values',
      data: { config: this.currentConfig }
    });
  }

  /**
   * Update resource metrics for prioritization decisions
   */
  public updateResourceMetrics(metrics: Partial<ResourceMetrics>): void {
    this.resourceMetrics = {
      ...this.resourceMetrics,
      ...metrics,
      timestamp: Date.now()
    } as ResourceMetrics;

    // Check if resource-based optimization is needed
    this.checkResourceOptimization();
  }

  /**
   * Add a custom prioritization rule
   */
  public addPrioritizationRule(rule: ResourcePrioritizationRule): void {
    this.prioritizationRules.push(rule);
    this.prioritizationRules.sort((a, b) => b.priority - a.priority);

    logger.logStructured({
      level: LogLevel.INFO,
      message: 'Added prioritization rule',
      data: { description: rule.description, priority: rule.priority }
    });
  }

  /**
   * Remove a prioritization rule by description
   */
  public removePrioritizationRule(description: string): boolean {
    const initialLength = this.prioritizationRules.length;
    this.prioritizationRules = this.prioritizationRules.filter(rule => rule.description !== description);

    const removed = this.prioritizationRules.length < initialLength;
    if (removed) {
      logger.logStructured({
        level: LogLevel.INFO,
        message: 'Removed prioritization rule',
        data: { description }
      });
    }

    return removed;
  }

  /**
   * Get current resource metrics
   */
  public getResourceMetrics(): ResourceMetrics | null {
    return this.resourceMetrics ? { ...this.resourceMetrics } : null;
  }

  /**
   * Manually trigger resource optimization
   */
  public optimizeForResources(): ConfigValidationResult | null {
    if (!this.resourceMetrics) {
      logger.logStructured({
        level: LogLevel.WARN,
        message: 'Cannot optimize for resources: no metrics available'
      });
      return null;
    }

    return this.applyResourceOptimization(this.resourceMetrics);
  }

  /**
   * Dispose of the config manager
   */
  public dispose(): void {
    if (this.metricsUpdateInterval) {
      clearInterval(this.metricsUpdateInterval);
      this.metricsUpdateInterval = null;
    }
    this.removeAllListeners();
  }

  private setupDefaultPrioritizationRules(): void {
    // High memory usage rule
    this.addPrioritizationRule({
      condition: (metrics, config) => {
        const estimatedMemoryUsage = metrics.preservedSessions * 1; // 1MB per session estimate
        return estimatedMemoryUsage > metrics.availableMemoryMB * 0.7;
      },
      adjustment: (config) => ({
        preservationTimeoutMs: Math.max(config.preservationTimeoutMs * 0.7, 2 * 60 * 1000), // Reduce by 30%, min 2 minutes
        maxPreservedSessionsPerUser: Math.max(config.maxPreservedSessionsPerUser - 1, 1)
      }),
      description: 'High memory usage optimization',
      priority: 100
    });

    // High CPU usage rule
    this.addPrioritizationRule({
      condition: (metrics, config) => metrics.cpuUsagePercent > 85,
      adjustment: (config) => ({
        healthCheckIntervalMs: Math.min(config.healthCheckIntervalMs * 1.5, 2 * 60 * 1000), // Increase by 50%, max 2 minutes
        cleanupIntervalMs: Math.min(config.cleanupIntervalMs * 1.3, 5 * 60 * 1000), // Increase by 30%, max 5 minutes
        maxAutoReconnectAttempts: Math.max(config.maxAutoReconnectAttempts - 1, 1)
      }),
      description: 'High CPU usage optimization',
      priority: 90
    });

    // High session count rule
    this.addPrioritizationRule({
      condition: (metrics, config) => metrics.activeSessions > 1000,
      adjustment: (config) => ({
        healthCheckIntervalMs: Math.min(config.healthCheckIntervalMs * 1.2, 90 * 1000), // Increase by 20%, max 90 seconds
        maxAutoReconnectAttempts: Math.max(config.maxAutoReconnectAttempts - 1, 2)
      }),
      description: 'High session count optimization',
      priority: 80
    });

    // Critical resource shortage rule
    this.addPrioritizationRule({
      condition: (metrics, config) => {
        const memoryUsagePercent = (metrics.preservedSessions * 1) / metrics.availableMemoryMB * 100;
        return memoryUsagePercent > 90 || metrics.cpuUsagePercent > 95;
      },
      adjustment: (config) => ({
        preservationTimeoutMs: Math.max(config.preservationTimeoutMs * 0.5, 60 * 1000), // Reduce by 50%, min 1 minute
        maxAutoReconnectAttempts: 1,
        maxPreservedSessionsPerUser: 1,
        healthCheckIntervalMs: Math.min(config.healthCheckIntervalMs * 2, 3 * 60 * 1000) // Double, max 3 minutes
      }),
      description: 'Critical resource shortage emergency optimization',
      priority: 200
    });
  }

  private startResourceMonitoring(): void {
    // Start periodic resource optimization checks
    this.metricsUpdateInterval = setInterval(() => {
      if (this.resourceMetrics) {
        this.checkResourceOptimization();
      }
    }, 30 * 1000); // Check every 30 seconds
  }

  private checkResourceOptimization(): void {
    if (!this.resourceMetrics) return;

    const now = Date.now();
    if (now - this.lastResourceOptimization < this.RESOURCE_OPTIMIZATION_COOLDOWN) {
      return; // Too soon since last optimization
    }

    // Check if any prioritization rules apply
    const applicableRules = this.prioritizationRules.filter(rule =>
      rule.condition(this.resourceMetrics!, this.currentConfig)
    );

    if (applicableRules.length > 0) {
      this.applyResourceOptimization(this.resourceMetrics);
    }
  }

  private applyResourceOptimization(metrics: ResourceMetrics): ConfigValidationResult {
    const oldConfig = { ...this.currentConfig };
    let adjustments: Partial<ReconnectionConfig> = {};

    // Apply all applicable rules in priority order
    const applicableRules = this.prioritizationRules.filter(rule =>
      rule.condition(metrics, this.currentConfig)
    );

    for (const rule of applicableRules) {
      const ruleAdjustments = rule.adjustment(this.currentConfig);
      adjustments = { ...adjustments, ...ruleAdjustments };

      logger.logStructured({
        level: LogLevel.INFO,
        message: 'Applying resource optimization rule',
        data: {
          rule: rule.description,
          adjustments: ruleAdjustments,
          metrics
        }
      });
    }

    if (Object.keys(adjustments).length === 0) {
      return { isValid: true, errors: [], warnings: [] };
    }

    // Validate and apply the optimized configuration
    const { config: optimizedConfig, validation } = ReconnectionConfigValidator.mergeAndValidateConfig(
      { ...this.currentConfig, ...adjustments }
    );

    if (validation.isValid) {
      this.currentConfig = optimizedConfig;
      this.lastResourceOptimization = Date.now();

      const updateEvent: ConfigUpdateEvent = {
        oldConfig,
        newConfig: optimizedConfig,
        timestamp: Date.now(),
        source: 'resource-optimization'
      };

      this.emit('configUpdated', updateEvent);

      logger.logStructured({
        level: LogLevel.INFO,
        message: 'Resource-based configuration optimization applied',
        data: {
          appliedRules: applicableRules.map(r => r.description),
          changes: this.getConfigDifferences(oldConfig, optimizedConfig),
          metrics
        }
      });
    } else {
      logger.logStructured({
        level: LogLevel.ERROR,
        message: 'Resource optimization failed validation',
        data: {
          errors: validation.errors,
          warnings: validation.warnings,
          attemptedAdjustments: adjustments
        }
      });
    }

    return validation;
  }

  private getConfigDifferences(oldConfig: ReconnectionConfig, newConfig: ReconnectionConfig): Record<string, { old: any; new: any }> {
    const differences: Record<string, { old: any; new: any }> = {};

    for (const key of Object.keys(newConfig) as (keyof ReconnectionConfig)[]) {
      if (JSON.stringify(oldConfig[key]) !== JSON.stringify(newConfig[key])) {
        differences[key] = {
          old: oldConfig[key],
          new: newConfig[key]
        };
      }
    }

    return differences;
  }
}