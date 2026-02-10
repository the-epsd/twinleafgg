import { ReconnectionConfig } from '../interfaces/reconnection.interface';
import { logger, LogLevel } from '../../utils/logger';

export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ConfigValidationOptions {
  strict?: boolean;
  allowPartialConfig?: boolean;
}

export class ReconnectionConfigValidator {
  private static readonly MIN_PRESERVATION_TIMEOUT = 30 * 1000; // 30 seconds
  private static readonly MAX_PRESERVATION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly MIN_RECONNECT_ATTEMPTS = 1;
  private static readonly MAX_RECONNECT_ATTEMPTS = 10;
  private static readonly MIN_INTERVAL = 1000; // 1 second
  private static readonly MAX_INTERVAL = 60 * 1000; // 1 minute
  private static readonly MIN_HEALTH_CHECK_INTERVAL = 5 * 1000; // 5 seconds
  private static readonly MAX_HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private static readonly MIN_CLEANUP_INTERVAL = 10 * 1000; // 10 seconds
  private static readonly MAX_CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes
  private static readonly MIN_MAX_SESSIONS = 1;
  private static readonly MAX_MAX_SESSIONS = 5;

  /**
   * Validates a complete reconnection configuration
   */
  public static validateConfig(
    config: Partial<ReconnectionConfig>,
    options: ConfigValidationOptions = {}
  ): ConfigValidationResult {
    const result: ConfigValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    const { strict = false, allowPartialConfig = false } = options;

    // Check for required fields if not allowing partial config
    if (!allowPartialConfig) {
      const requiredFields: (keyof ReconnectionConfig)[] = [
        'preservationTimeoutMs',
        'maxAutoReconnectAttempts',
        'reconnectIntervals',
        'healthCheckIntervalMs',
        'cleanupIntervalMs',
        'maxPreservedSessionsPerUser',
        'disconnectForfeitMs'
      ];

      for (const field of requiredFields) {
        if (config[field] === undefined || config[field] === null) {
          result.errors.push(`Missing required field: ${field}`);
        }
      }
    }

    // Validate preservation timeout
    if (config.preservationTimeoutMs !== undefined) {
      const timeout = config.preservationTimeoutMs;
      if (!Number.isInteger(timeout) || timeout < 0) {
        result.errors.push('preservationTimeoutMs must be a non-negative integer');
      } else if (timeout < this.MIN_PRESERVATION_TIMEOUT) {
        result.errors.push(`preservationTimeoutMs must be at least ${this.MIN_PRESERVATION_TIMEOUT}ms (${this.MIN_PRESERVATION_TIMEOUT / 1000}s)`);
      } else if (timeout > this.MAX_PRESERVATION_TIMEOUT) {
        if (strict) {
          result.errors.push(`preservationTimeoutMs must not exceed ${this.MAX_PRESERVATION_TIMEOUT}ms (${this.MAX_PRESERVATION_TIMEOUT / 60000}m)`);
        } else {
          result.warnings.push(`preservationTimeoutMs of ${timeout}ms (${timeout / 60000}m) is very high and may consume excessive resources`);
        }
      }
    }

    // Validate max auto reconnect attempts
    if (config.maxAutoReconnectAttempts !== undefined) {
      const attempts = config.maxAutoReconnectAttempts;
      if (!Number.isInteger(attempts) || attempts < 0) {
        result.errors.push('maxAutoReconnectAttempts must be a non-negative integer');
      } else if (attempts < this.MIN_RECONNECT_ATTEMPTS) {
        result.errors.push(`maxAutoReconnectAttempts must be at least ${this.MIN_RECONNECT_ATTEMPTS}`);
      } else if (attempts > this.MAX_RECONNECT_ATTEMPTS) {
        if (strict) {
          result.errors.push(`maxAutoReconnectAttempts must not exceed ${this.MAX_RECONNECT_ATTEMPTS}`);
        } else {
          result.warnings.push(`maxAutoReconnectAttempts of ${attempts} is very high and may cause excessive network traffic`);
        }
      }
    }

    // Validate reconnect intervals
    if (config.reconnectIntervals !== undefined) {
      const intervals = config.reconnectIntervals;
      if (!Array.isArray(intervals)) {
        result.errors.push('reconnectIntervals must be an array');
      } else if (intervals.length === 0) {
        result.errors.push('reconnectIntervals must contain at least one interval');
      } else {
        for (let i = 0; i < intervals.length; i++) {
          const interval = intervals[i];
          if (!Number.isInteger(interval) || interval < 0) {
            result.errors.push(`reconnectIntervals[${i}] must be a non-negative integer`);
          } else if (interval < this.MIN_INTERVAL) {
            result.errors.push(`reconnectIntervals[${i}] must be at least ${this.MIN_INTERVAL}ms`);
          } else if (interval > this.MAX_INTERVAL) {
            if (strict) {
              result.errors.push(`reconnectIntervals[${i}] must not exceed ${this.MAX_INTERVAL}ms`);
            } else {
              result.warnings.push(`reconnectIntervals[${i}] of ${interval}ms is very high`);
            }
          }
        }

        // Check for increasing intervals (recommended pattern)
        for (let i = 1; i < intervals.length; i++) {
          if (intervals[i] < intervals[i - 1]) {
            result.warnings.push('reconnectIntervals should generally increase to implement exponential backoff');
            break;
          }
        }
      }
    }

    // Validate health check interval
    if (config.healthCheckIntervalMs !== undefined) {
      const interval = config.healthCheckIntervalMs;
      if (!Number.isInteger(interval) || interval < 0) {
        result.errors.push('healthCheckIntervalMs must be a non-negative integer');
      } else if (interval < this.MIN_HEALTH_CHECK_INTERVAL) {
        result.errors.push(`healthCheckIntervalMs must be at least ${this.MIN_HEALTH_CHECK_INTERVAL}ms`);
      } else if (interval > this.MAX_HEALTH_CHECK_INTERVAL) {
        if (strict) {
          result.errors.push(`healthCheckIntervalMs must not exceed ${this.MAX_HEALTH_CHECK_INTERVAL}ms`);
        } else {
          result.warnings.push(`healthCheckIntervalMs of ${interval}ms is very high and may delay disconnection detection`);
        }
      }
    }

    // Validate cleanup interval
    if (config.cleanupIntervalMs !== undefined) {
      const interval = config.cleanupIntervalMs;
      if (!Number.isInteger(interval) || interval < 0) {
        result.errors.push('cleanupIntervalMs must be a non-negative integer');
      } else if (interval < this.MIN_CLEANUP_INTERVAL) {
        result.errors.push(`cleanupIntervalMs must be at least ${this.MIN_CLEANUP_INTERVAL}ms`);
      } else if (interval > this.MAX_CLEANUP_INTERVAL) {
        if (strict) {
          result.errors.push(`cleanupIntervalMs must not exceed ${this.MAX_CLEANUP_INTERVAL}ms`);
        } else {
          result.warnings.push(`cleanupIntervalMs of ${interval}ms is very high and may delay cleanup of expired sessions`);
        }
      }
    }

    // Validate max preserved sessions per user
    if (config.maxPreservedSessionsPerUser !== undefined) {
      const maxSessions = config.maxPreservedSessionsPerUser;
      if (!Number.isInteger(maxSessions) || maxSessions < 0) {
        result.errors.push('maxPreservedSessionsPerUser must be a non-negative integer');
      } else if (maxSessions < this.MIN_MAX_SESSIONS) {
        result.errors.push(`maxPreservedSessionsPerUser must be at least ${this.MIN_MAX_SESSIONS}`);
      } else if (maxSessions > this.MAX_MAX_SESSIONS) {
        if (strict) {
          result.errors.push(`maxPreservedSessionsPerUser must not exceed ${this.MAX_MAX_SESSIONS}`);
        } else {
          result.warnings.push(`maxPreservedSessionsPerUser of ${maxSessions} is very high and may consume excessive memory`);
        }
      }
    }

    // Validate disconnect forfeit timeout (min 10s, max 5 min)
    const MIN_DISCONNECT_FORFEIT_MS = 10 * 1000;
    const MAX_DISCONNECT_FORFEIT_MS = 5 * 60 * 1000;
    if (config.disconnectForfeitMs !== undefined) {
      const ms = config.disconnectForfeitMs;
      if (!Number.isInteger(ms) || ms < 0) {
        result.errors.push('disconnectForfeitMs must be a non-negative integer');
      } else if (ms < MIN_DISCONNECT_FORFEIT_MS) {
        result.errors.push(`disconnectForfeitMs must be at least ${MIN_DISCONNECT_FORFEIT_MS}ms (10s)`);
      } else if (ms > MAX_DISCONNECT_FORFEIT_MS) {
        result.warnings.push(`disconnectForfeitMs of ${ms}ms is high; consider ${MAX_DISCONNECT_FORFEIT_MS}ms (5 min) max`);
      }
    }

    // Cross-field validations
    if (config.preservationTimeoutMs !== undefined && config.cleanupIntervalMs !== undefined) {
      if (config.cleanupIntervalMs > config.preservationTimeoutMs / 2) {
        result.warnings.push('cleanupIntervalMs should be significantly smaller than preservationTimeoutMs for efficient cleanup');
      }
    }

    if (config.maxAutoReconnectAttempts !== undefined && config.reconnectIntervals !== undefined) {
      if (config.reconnectIntervals.length < config.maxAutoReconnectAttempts) {
        result.warnings.push('reconnectIntervals array should have at least as many entries as maxAutoReconnectAttempts');
      }
    }

    result.isValid = result.errors.length === 0;

    // Log validation results
    if (result.errors.length > 0) {
      logger.logStructured({
        level: LogLevel.ERROR,
        message: 'Configuration validation failed',
        data: {
          errors: result.errors,
          warnings: result.warnings,
          config
        }
      });
    } else if (result.warnings.length > 0) {
      logger.logStructured({
        level: LogLevel.WARN,
        message: 'Configuration validation completed with warnings',
        data: {
          warnings: result.warnings,
          config
        }
      });
    }

    return result;
  }

  /**
   * Creates a default configuration with all required fields
   */
  public static getDefaultConfig(): ReconnectionConfig {
    return {
      preservationTimeoutMs: 5 * 60 * 1000, // 5 minutes
      maxAutoReconnectAttempts: 3,
      reconnectIntervals: [5000, 10000, 15000], // 5s, 10s, 15s
      healthCheckIntervalMs: 30 * 1000, // 30 seconds
      cleanupIntervalMs: 60 * 1000, // 1 minute
      maxPreservedSessionsPerUser: 1,
      disconnectForfeitMs: 60 * 1000 // 60 seconds before auto-forfeit
    };
  }

  /**
   * Merges partial configuration with defaults and validates the result
   */
  public static mergeAndValidateConfig(
    partialConfig: Partial<ReconnectionConfig>,
    options: ConfigValidationOptions = {}
  ): { config: ReconnectionConfig; validation: ConfigValidationResult } {
    const defaultConfig = this.getDefaultConfig();
    const mergedConfig = { ...defaultConfig, ...partialConfig };

    const validation = this.validateConfig(mergedConfig, { ...options, allowPartialConfig: false });

    return {
      config: mergedConfig,
      validation
    };
  }

  /**
   * Validates configuration for resource constraints
   */
  public static validateResourceConstraints(
    config: ReconnectionConfig,
    resourceMetrics: {
      availableMemoryMB: number;
      activeSessions: number;
      cpuUsagePercent: number;
    }
  ): ConfigValidationResult {
    const result: ConfigValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    const { availableMemoryMB, activeSessions, cpuUsagePercent } = resourceMetrics;

    // Estimate memory usage per preserved session (rough estimate: 1MB per session)
    const estimatedMemoryPerSession = 1; // MB
    const maxPossibleSessions = activeSessions * config.maxPreservedSessionsPerUser;
    const estimatedMemoryUsage = maxPossibleSessions * estimatedMemoryPerSession;

    if (estimatedMemoryUsage > availableMemoryMB * 0.5) {
      result.warnings.push(`Estimated memory usage (${estimatedMemoryUsage}MB) may exceed 50% of available memory (${availableMemoryMB}MB)`);
    }

    if (estimatedMemoryUsage > availableMemoryMB * 0.8) {
      result.errors.push(`Estimated memory usage (${estimatedMemoryUsage}MB) may exceed 80% of available memory (${availableMemoryMB}MB)`);
    }

    // Check CPU constraints
    if (cpuUsagePercent > 80) {
      result.warnings.push(`High CPU usage (${cpuUsagePercent}%) may affect reconnection performance`);

      if (config.healthCheckIntervalMs < 30000) {
        result.warnings.push('Consider increasing healthCheckIntervalMs to reduce CPU load');
      }

      if (config.cleanupIntervalMs < 60000) {
        result.warnings.push('Consider increasing cleanupIntervalMs to reduce CPU load');
      }
    }

    // Check for high-frequency operations under load
    if (activeSessions > 1000) {
      if (config.healthCheckIntervalMs < 60000) {
        result.warnings.push('Consider increasing healthCheckIntervalMs for high session counts');
      }

      if (config.maxAutoReconnectAttempts > 3) {
        result.warnings.push('Consider reducing maxAutoReconnectAttempts for high session counts');
      }
    }

    result.isValid = result.errors.length === 0;

    return result;
  }
}