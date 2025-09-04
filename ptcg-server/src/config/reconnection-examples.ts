/**
 * Reconnection Configuration Examples
 * 
 * This file provides example configurations for different deployment scenarios.
 * These examples demonstrate how to configure the reconnection system for
 * optimal performance in various environments.
 */

import { ReconnectionConfig } from '../backend/interfaces/reconnection.interface';
import { ReconnectionConfigValidator } from '../backend/services/reconnection-config-validator';
import { ReconnectionConfigManager } from '../backend/services/reconnection-config-manager';

/**
 * Development Environment Configuration
 * 
 * Optimized for development with fast feedback and debugging capabilities.
 * Features shorter timeouts and more frequent checks for rapid iteration.
 */
export const developmentConfig: ReconnectionConfig = {
  preservationTimeoutMs: 2 * 60 * 1000,      // 2 minutes - short for quick testing
  maxAutoReconnectAttempts: 2,                // Fewer attempts for faster failure
  reconnectIntervals: [2000, 5000],          // Quick reconnection attempts
  healthCheckIntervalMs: 15 * 1000,          // Frequent health checks for debugging
  cleanupIntervalMs: 30 * 1000,              // Frequent cleanup for memory management
  maxPreservedSessionsPerUser: 1             // Single session for simplicity
};

/**
 * Production Environment Configuration (Standard)
 * 
 * Balanced configuration suitable for most production environments.
 * Provides good user experience while maintaining reasonable resource usage.
 */
export const productionConfig: ReconnectionConfig = {
  preservationTimeoutMs: 5 * 60 * 1000,      // 5 minutes - standard timeout
  maxAutoReconnectAttempts: 3,                // Standard retry count
  reconnectIntervals: [5000, 10000, 15000],  // Exponential backoff pattern
  healthCheckIntervalMs: 30 * 1000,          // 30 second health checks
  cleanupIntervalMs: 60 * 1000,              // 1 minute cleanup interval
  maxPreservedSessionsPerUser: 1             // Single session per user
};

/**
 * High-Load Environment Configuration
 * 
 * Optimized for environments with high concurrent user counts.
 * Reduces resource usage at the cost of some user experience features.
 */
export const highLoadConfig: ReconnectionConfig = {
  preservationTimeoutMs: 3 * 60 * 1000,      // Shorter preservation to save memory
  maxAutoReconnectAttempts: 2,                // Fewer attempts to reduce load
  reconnectIntervals: [10000, 20000],        // Longer intervals to reduce traffic
  healthCheckIntervalMs: 60 * 1000,          // Less frequent health checks
  cleanupIntervalMs: 2 * 60 * 1000,          // Less frequent cleanup
  maxPreservedSessionsPerUser: 1             // Single session to minimize memory
};

/**
 * Resource-Constrained Environment Configuration
 * 
 * Optimized for environments with limited memory and CPU resources.
 * Minimizes resource usage while maintaining basic reconnection functionality.
 */
export const resourceConstrainedConfig: ReconnectionConfig = {
  preservationTimeoutMs: 2 * 60 * 1000,      // Short preservation window
  maxAutoReconnectAttempts: 1,                // Minimal automatic attempts
  reconnectIntervals: [15000],               // Single, longer interval
  healthCheckIntervalMs: 2 * 60 * 1000,      // Infrequent health checks
  cleanupIntervalMs: 5 * 60 * 1000,          // Infrequent cleanup
  maxPreservedSessionsPerUser: 1             // Single session only
};

/**
 * Unreliable Network Environment Configuration
 * 
 * Optimized for environments where users frequently experience network issues.
 * Provides extended timeouts and more reconnection attempts.
 */
export const unreliableNetworkConfig: ReconnectionConfig = {
  preservationTimeoutMs: 10 * 60 * 1000,     // Extended preservation for network issues
  maxAutoReconnectAttempts: 5,                // More attempts for unreliable connections
  reconnectIntervals: [5000, 10000, 15000, 20000, 30000], // Extended backoff sequence
  healthCheckIntervalMs: 20 * 1000,          // More frequent monitoring
  cleanupIntervalMs: 60 * 1000,              // Standard cleanup
  maxPreservedSessionsPerUser: 1             // Single session
};

/**
 * Gaming Tournament Configuration
 * 
 * Optimized for competitive gaming environments where reconnection
 * reliability is critical and resources are typically abundant.
 */
export const tournamentConfig: ReconnectionConfig = {
  preservationTimeoutMs: 15 * 60 * 1000,     // Extended timeout for important matches
  maxAutoReconnectAttempts: 4,                // Multiple attempts for reliability
  reconnectIntervals: [3000, 6000, 12000, 20000], // Aggressive initial attempts
  healthCheckIntervalMs: 15 * 1000,          // Frequent monitoring
  cleanupIntervalMs: 60 * 1000,              // Standard cleanup
  maxPreservedSessionsPerUser: 2             // Allow multiple sessions for flexibility
};

/**
 * Configuration Factory
 * 
 * Provides a convenient way to get pre-configured setups for different environments.
 */
export class ReconnectionConfigFactory {
  /**
   * Get configuration for a specific environment
   */
  public static getConfig(environment: 'development' | 'production' | 'high-load' | 'resource-constrained' | 'unreliable-network' | 'tournament'): ReconnectionConfig {
    switch (environment) {
      case 'development':
        return { ...developmentConfig };
      case 'production':
        return { ...productionConfig };
      case 'high-load':
        return { ...highLoadConfig };
      case 'resource-constrained':
        return { ...resourceConstrainedConfig };
      case 'unreliable-network':
        return { ...unreliableNetworkConfig };
      case 'tournament':
        return { ...tournamentConfig };
      default:
        return { ...productionConfig };
    }
  }

  /**
   * Create a validated configuration manager for an environment
   */
  public static createConfigManager(environment: 'development' | 'production' | 'high-load' | 'resource-constrained' | 'unreliable-network' | 'tournament'): ReconnectionConfigManager {
    const config = this.getConfig(environment);

    // Validate the configuration before creating the manager
    const validation = ReconnectionConfigValidator.validateConfig(config);
    if (!validation.isValid) {
      throw new Error(`Invalid configuration for environment '${environment}': ${validation.errors.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
      console.warn(`Configuration warnings for environment '${environment}':`, validation.warnings);
    }

    return new ReconnectionConfigManager(config);
  }

  /**
   * Create a custom configuration with validation
   */
  public static createCustomConfig(
    baseEnvironment: 'development' | 'production' | 'high-load' | 'resource-constrained' | 'unreliable-network' | 'tournament',
    overrides: Partial<ReconnectionConfig>
  ): ReconnectionConfig {
    const baseConfig = this.getConfig(baseEnvironment);
    const customConfig = { ...baseConfig, ...overrides };

    // Validate the custom configuration
    const validation = ReconnectionConfigValidator.validateConfig(customConfig);
    if (!validation.isValid) {
      throw new Error(`Invalid custom configuration: ${validation.errors.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
      console.warn('Custom configuration warnings:', validation.warnings);
    }

    return customConfig;
  }

  /**
   * Get all available environment configurations
   */
  public static getAllConfigs(): Record<string, ReconnectionConfig> {
    return {
      development: developmentConfig,
      production: productionConfig,
      'high-load': highLoadConfig,
      'resource-constrained': resourceConstrainedConfig,
      'unreliable-network': unreliableNetworkConfig,
      tournament: tournamentConfig
    };
  }

  /**
   * Compare two configurations and show differences
   */
  public static compareConfigs(config1: ReconnectionConfig, config2: ReconnectionConfig): Record<string, { config1: any; config2: any }> {
    const differences: Record<string, { config1: any; config2: any }> = {};

    for (const key of Object.keys(config1) as (keyof ReconnectionConfig)[]) {
      if (JSON.stringify(config1[key]) !== JSON.stringify(config2[key])) {
        differences[key] = {
          config1: config1[key],
          config2: config2[key]
        };
      }
    }

    return differences;
  }
}

/**
 * Example Usage:
 * 
 * // Get a pre-configured setup
 * const configManager = ReconnectionConfigFactory.createConfigManager('production');
 * 
 * // Create a custom configuration
 * const customConfig = ReconnectionConfigFactory.createCustomConfig('production', {
 *   preservationTimeoutMs: 8 * 60 * 1000,  // 8 minutes instead of 5
 *   maxAutoReconnectAttempts: 4             // 4 attempts instead of 3
 * });
 * 
 * // Runtime configuration updates
 * configManager.updateConfig({
 *   preservationTimeoutMs: 10 * 60 * 1000  // Increase to 10 minutes
 * });
 * 
 * // Resource-based optimization
 * configManager.updateResourceMetrics({
 *   availableMemoryMB: 1024,
 *   activeSessions: 500,
 *   cpuUsagePercent: 75,
 *   preservedSessions: 50
 * });
 * 
 * // Listen for configuration changes
 * configManager.on('configUpdated', (event) => {
 *   console.log(`Configuration updated: ${event.source}`);
 *   console.log('New config:', event.newConfig);
 * });
 */