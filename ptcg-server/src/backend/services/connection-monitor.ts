import { Socket } from 'socket.io';
import { SocketClient } from '../socket/socket-client';
import { ConnectionMetrics, ReconnectionConfig } from '../interfaces/reconnection.interface';
import { logger, LogLevel } from '../../utils/logger';

export interface ConnectionMonitorOptions {
  pingInterval?: number;
  pingTimeout?: number;
  qualityCheckInterval?: number;
  maxLatencyForExcellent?: number;
  maxLatencyForGood?: number;
  maxLatencyForPoor?: number;
  maxPacketLossForStable?: number;
}

export class ConnectionMonitor {
  private monitoredConnections = new Map<number, MonitoredConnection>();
  private config: ReconnectionConfig;
  private options: Required<ConnectionMonitorOptions>;
  private qualityCheckTimer?: NodeJS.Timeout;

  constructor(config: ReconnectionConfig, options: ConnectionMonitorOptions = {}) {
    this.config = config;
    this.options = {
      pingInterval: options.pingInterval ?? 30000, // 30 seconds
      pingTimeout: options.pingTimeout ?? 10000, // 10 seconds
      qualityCheckInterval: options.qualityCheckInterval ?? 60000, // 1 minute
      maxLatencyForExcellent: options.maxLatencyForExcellent ?? 50, // 50ms
      maxLatencyForGood: options.maxLatencyForGood ?? 150, // 150ms
      maxLatencyForPoor: options.maxLatencyForPoor ?? 500, // 500ms
      maxPacketLossForStable: options.maxPacketLossForStable ?? 0.05 // 5%
    };

    this.startQualityCheckTimer();
  }

  /**
   * Start monitoring a client connection
   */
  public startMonitoring(client: SocketClient): void {
    const clientId = client.user.id;

    if (this.monitoredConnections.has(clientId)) {
      logger.logStructured({
        level: LogLevel.WARN,
        category: 'connection-monitor',
        message: 'Already monitoring client, stopping previous monitoring',
        userId: clientId
      });
      this.stopMonitoring(client);
    }

    const monitoredConnection: MonitoredConnection = {
      clientId,
      client,
      socket: client.socket.socket,
      startTime: Date.now(),
      lastPing: Date.now(),
      lastPong: Date.now(),
      pingHistory: [],
      packetsSent: 0,
      packetsReceived: 0,
      connectionQuality: 'excellent',
      isStable: true,
      pingTimer: undefined,
      reconnectionAttempts: 0,
      lastReconnectionAttempt: 0
    };

    this.monitoredConnections.set(clientId, monitoredConnection);
    this.setupPingMonitoring(monitoredConnection);

    logger.logStructured({
      level: LogLevel.INFO,
      category: 'connection-monitor',
      message: 'Started monitoring client connection',
      userId: clientId,
      data: {
        startTime: monitoredConnection.startTime,
        pingInterval: this.options.pingInterval
      }
    });
  }

  /**
   * Stop monitoring a client connection
   */
  public stopMonitoring(client: SocketClient): void {
    const clientId = client.user.id;
    const monitoredConnection = this.monitoredConnections.get(clientId);

    if (monitoredConnection) {
      const monitoringDuration = Date.now() - monitoredConnection.startTime;

      if (monitoredConnection.pingTimer) {
        clearInterval(monitoredConnection.pingTimer);
      }

      // Remove socket event listeners
      monitoredConnection.socket.off('pong', monitoredConnection.pongHandler!);

      this.monitoredConnections.delete(clientId);

      logger.logStructured({
        level: LogLevel.INFO,
        category: 'connection-monitor',
        message: 'Stopped monitoring client connection',
        userId: clientId,
        data: {
          monitoringDurationMs: monitoringDuration,
          finalQuality: monitoredConnection.connectionQuality,
          totalPingsSent: monitoredConnection.packetsSent,
          totalPongsReceived: monitoredConnection.packetsReceived,
          reconnectionAttempts: monitoredConnection.reconnectionAttempts
        }
      });
    }
  }

  /**
   * Check if a connection is stable
   */
  public isConnectionStable(clientId: number): boolean {
    const connection = this.monitoredConnections.get(clientId);
    return connection?.isStable ?? false;
  }

  /**
   * Get connection metrics for a client
   */
  public getConnectionMetrics(clientId: number): ConnectionMetrics | null {
    const connection = this.monitoredConnections.get(clientId);

    if (!connection) {
      return null;
    }

    const averageLatency = this.calculateAverageLatency(connection);
    const packetLoss = this.calculatePacketLoss(connection);

    return {
      clientId,
      lastPing: connection.lastPing,
      averageLatency,
      packetLoss,
      connectionQuality: connection.connectionQuality
    };
  }

  /**
   * Attempt automatic reconnection for a client
   */
  public async attemptAutomaticReconnection(clientId: number): Promise<boolean> {
    const connection = this.monitoredConnections.get(clientId);

    if (!connection) {
      logger.logStructured({
        level: LogLevel.WARN,
        category: 'auto-reconnection',
        message: 'Cannot attempt reconnection for unknown client',
        userId: clientId
      });
      return false;
    }

    const now = Date.now();
    const timeSinceLastAttempt = now - connection.lastReconnectionAttempt;
    const minInterval = this.config.reconnectIntervals[Math.min(connection.reconnectionAttempts, this.config.reconnectIntervals.length - 1)];

    // Check if enough time has passed since last attempt
    if (timeSinceLastAttempt < minInterval) {
      logger.logStructured({
        level: LogLevel.DEBUG,
        category: 'auto-reconnection',
        message: 'Too soon for reconnection attempt',
        userId: clientId,
        data: {
          timeSinceLastAttempt,
          minInterval,
          nextAttemptIn: minInterval - timeSinceLastAttempt
        }
      });
      return false;
    }

    // Check if we've exceeded max attempts
    if (connection.reconnectionAttempts >= this.config.maxAutoReconnectAttempts) {
      logger.logStructured({
        level: LogLevel.WARN,
        category: 'auto-reconnection',
        message: 'Max reconnection attempts reached',
        userId: clientId,
        data: {
          attempts: connection.reconnectionAttempts,
          maxAttempts: this.config.maxAutoReconnectAttempts
        }
      });
      return false;
    }

    connection.reconnectionAttempts++;
    connection.lastReconnectionAttempt = now;

    const nextAttemptIn = this.config.reconnectIntervals[Math.min(connection.reconnectionAttempts, this.config.reconnectIntervals.length - 1)];

    logger.logAutomaticReconnectionAttempt(clientId, connection.reconnectionAttempts, this.config.maxAutoReconnectAttempts, nextAttemptIn);

    try {
      // Emit reconnection attempt event to client
      connection.socket.emit('connection:reconnect-attempt', {
        attempt: connection.reconnectionAttempts,
        maxAttempts: this.config.maxAutoReconnectAttempts,
        nextAttemptIn
      });

      // Test connection with a ping
      const pingResult = await this.testConnection(connection);

      if (pingResult.success) {
        connection.reconnectionAttempts = 0;
        connection.isStable = true;

        logger.logStructured({
          level: LogLevel.INFO,
          category: 'auto-reconnection',
          message: 'Automatic reconnection successful',
          userId: clientId,
          data: {
            latency: pingResult.latency,
            quality: connection.connectionQuality
          }
        });

        // Emit reconnection success
        connection.socket.emit('connection:reconnect-success', {
          latency: pingResult.latency,
          quality: connection.connectionQuality
        });

        return true;
      } else {
        logger.logStructured({
          level: LogLevel.WARN,
          category: 'auto-reconnection',
          message: 'Automatic reconnection failed',
          userId: clientId,
          data: {
            attempt: connection.reconnectionAttempts,
            maxAttempts: this.config.maxAutoReconnectAttempts,
            error: pingResult.error,
            nextAttemptIn: connection.reconnectionAttempts < this.config.maxAutoReconnectAttempts ? nextAttemptIn : null
          }
        });

        // Emit reconnection failure
        connection.socket.emit('connection:reconnect-failed', {
          attempt: connection.reconnectionAttempts,
          maxAttempts: this.config.maxAutoReconnectAttempts,
          error: pingResult.error,
          nextAttemptIn: connection.reconnectionAttempts < this.config.maxAutoReconnectAttempts ? nextAttemptIn : null
        });

        return false;
      }
    } catch (error) {
      logger.logStructured({
        level: LogLevel.ERROR,
        category: 'auto-reconnection',
        message: 'Error during automatic reconnection',
        userId: clientId,
        data: {
          attempt: connection.reconnectionAttempts,
          maxAttempts: this.config.maxAutoReconnectAttempts
        },
        error: error as Error
      });
      return false;
    }
  }

  /**
   * Get all monitored connections
   */
  public getMonitoredConnections(): ConnectionMetrics[] {
    const metrics: ConnectionMetrics[] = [];

    for (const [clientId] of this.monitoredConnections) {
      const connectionMetrics = this.getConnectionMetrics(clientId);
      if (connectionMetrics) {
        metrics.push(connectionMetrics);
      }
    }

    return metrics;
  }

  /**
   * Dispose of the connection monitor
   */
  public dispose(): void {
    // Stop quality check timer
    if (this.qualityCheckTimer) {
      clearInterval(this.qualityCheckTimer);
    }

    // Stop monitoring all connections
    for (const [, connection] of this.monitoredConnections) {
      if (connection.pingTimer) {
        clearInterval(connection.pingTimer);
      }
      if (connection.pongHandler) {
        connection.socket.off('pong', connection.pongHandler);
      }
    }

    this.monitoredConnections.clear();
    logger.log('[ConnectionMonitor] Disposed');
  }

  /**
   * Setup ping monitoring for a connection
   */
  private setupPingMonitoring(connection: MonitoredConnection): void {
    // Setup pong handler
    connection.pongHandler = (data: Buffer) => {
      const now = Date.now();
      const latency = now - connection.lastPing;

      connection.lastPong = now;
      connection.packetsReceived++;

      // Add to ping history (keep last 10 pings)
      connection.pingHistory.push(latency);
      if (connection.pingHistory.length > 10) {
        connection.pingHistory.shift();
      }

      // Update connection quality
      this.updateConnectionQuality(connection);

      logger.logStructured({
        level: LogLevel.DEBUG,
        category: 'connection-monitor',
        message: 'Pong received',
        userId: connection.clientId,
        data: {
          latency,
          quality: connection.connectionQuality,
          packetsReceived: connection.packetsReceived
        }
      });
    };

    connection.socket.on('pong', connection.pongHandler);

    // Setup ping timer
    connection.pingTimer = setInterval(() => {
      this.sendPing(connection);
    }, this.options.pingInterval);

    // Send initial ping
    this.sendPing(connection);
  }

  /**
   * Send a ping to a connection
   */
  private sendPing(connection: MonitoredConnection): void {
    const now = Date.now();
    connection.lastPing = now;
    connection.packetsSent++;

    (connection.socket as any).ping();

    // Check for ping timeout
    setTimeout(() => {
      if (connection.lastPong < connection.lastPing) {
        logger.logStructured({
          level: LogLevel.WARN,
          category: 'connection-monitor',
          message: 'Ping timeout detected',
          userId: connection.clientId,
          data: {
            lastPing: connection.lastPing,
            lastPong: connection.lastPong,
            timeoutMs: this.options.pingTimeout
          }
        });

        connection.isStable = false;
        this.updateConnectionQuality(connection);

        // Emit connection unstable event
        connection.socket.emit('connection:unstable', {
          reason: 'ping_timeout',
          lastPing: connection.lastPing,
          lastPong: connection.lastPong
        });
      }
    }, this.options.pingTimeout);
  }

  /**
   * Test connection with a ping
   */
  private async testConnection(connection: MonitoredConnection): Promise<{ success: boolean; latency?: number; error?: string }> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const timeout = setTimeout(() => {
        resolve({ success: false, error: 'Connection test timeout' });
      }, this.options.pingTimeout);

      const testPongHandler = () => {
        clearTimeout(timeout);
        const latency = Date.now() - startTime;
        connection.socket.off('pong', testPongHandler);
        resolve({ success: true, latency });
      };

      connection.socket.once('pong', testPongHandler);
      (connection.socket as any).ping();
    });
  }

  /**
   * Calculate average latency for a connection
   */
  private calculateAverageLatency(connection: MonitoredConnection): number {
    if (connection.pingHistory.length === 0) {
      return 0;
    }

    const sum = connection.pingHistory.reduce((acc, latency) => acc + latency, 0);
    return Math.round(sum / connection.pingHistory.length);
  }

  /**
   * Calculate packet loss for a connection
   */
  private calculatePacketLoss(connection: MonitoredConnection): number {
    if (connection.packetsSent === 0) {
      return 0;
    }

    const lostPackets = connection.packetsSent - connection.packetsReceived;
    return Math.max(0, lostPackets / connection.packetsSent);
  }

  /**
   * Update connection quality based on metrics
   */
  private updateConnectionQuality(connection: MonitoredConnection): void {
    const averageLatency = this.calculateAverageLatency(connection);
    const packetLoss = this.calculatePacketLoss(connection);

    let quality: ConnectionMetrics['connectionQuality'];

    if (packetLoss > this.options.maxPacketLossForStable) {
      quality = 'unstable';
      connection.isStable = false;
    } else if (averageLatency <= this.options.maxLatencyForExcellent) {
      quality = 'excellent';
      connection.isStable = true;
    } else if (averageLatency <= this.options.maxLatencyForGood) {
      quality = 'good';
      connection.isStable = true;
    } else if (averageLatency <= this.options.maxLatencyForPoor) {
      quality = 'poor';
      connection.isStable = true;
    } else {
      quality = 'unstable';
      connection.isStable = false;
    }

    // Only emit event if quality changed
    if (connection.connectionQuality !== quality) {
      const previousQuality = connection.connectionQuality;
      connection.connectionQuality = quality;

      logger.logConnectionQualityChange(connection.clientId, previousQuality, quality, {
        averageLatency,
        packetLoss: Math.round(packetLoss * 100) / 100
      });

      // Emit quality change event
      connection.socket.emit('connection:quality-changed', {
        previousQuality,
        currentQuality: quality,
        averageLatency,
        packetLoss: Math.round(packetLoss * 100) / 100 // Round to 2 decimal places
      });

      // If connection became unstable, attempt automatic reconnection
      if (quality === 'unstable' && connection.isStable === false) {
        setTimeout(() => {
          this.attemptAutomaticReconnection(connection.clientId);
        }, 1000); // Wait 1 second before attempting reconnection
      }
    }
  }

  /**
   * Start the quality check timer
   */
  private startQualityCheckTimer(): void {
    this.qualityCheckTimer = setInterval(() => {
      for (const [, connection] of this.monitoredConnections) {
        this.updateConnectionQuality(connection);
      }
    }, this.options.qualityCheckInterval);
  }
}

interface MonitoredConnection {
  clientId: number;
  client: SocketClient;
  socket: Socket;
  startTime: number;
  lastPing: number;
  lastPong: number;
  pingHistory: number[];
  packetsSent: number;
  packetsReceived: number;
  connectionQuality: ConnectionMetrics['connectionQuality'];
  isStable: boolean;
  pingTimer?: NodeJS.Timeout;
  pongHandler?: (data: Buffer) => void;
  reconnectionAttempts: number;
  lastReconnectionAttempt: number;
}