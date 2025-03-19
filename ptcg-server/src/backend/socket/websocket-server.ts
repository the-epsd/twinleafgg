import * as http from 'http';
import { Server, Socket, ServerOptions } from 'socket.io';
import * as os from 'os';

import { Core } from '../../game/core/core';
import { SocketClient } from './socket-client';
import { User } from '../../storage';
import { authMiddleware } from './auth-middleware';
import { config } from '../../config';

export type Middleware = (socket: Socket, next: (err?: any) => void) => void;

interface Packet {
  type: string;
  data?: any;
}

interface Transport {
  name: string;
}

export class WebSocketServer {
  public server: Server | undefined;
  private clients: Map<string, SocketClient> = new Map();
  private statsInterval: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private readonly STATS_INTERVAL = 60000; // Log stats every minute


  constructor(private core: Core) { }

  public async listen(httpServer: http.Server): Promise<void> {
    const opts: Partial<ServerOptions> = {
      pingInterval: 25000,    // 25s ping interval for balance between responsiveness and overhead
      pingTimeout: 30000,     // 30s timeout to detect disconnections
      connectTimeout: 30000,  // 30s connection timeout
      transports: ['websocket'],  // WebSocket only for better performance
      allowUpgrades: true,
      upgradeTimeout: 30000,   // Time to complete transport upgrade
      perMessageDeflate: true, // Enable WebSocket compression
      httpCompression: true,   // Enable HTTP compression
      allowEIO3: true,        // Enable Engine.IO v3 for better compatibility
      maxHttpBufferSize: 1e8,  // 100 MB
    };

    if (config.backend.allowCors) {
      opts.cors = { origin: '*' };
    }

    try {
      const server = new Server(httpServer, opts);
      this.server = server;
      server.use(authMiddleware);

      server.on('connection', this.handleConnection.bind(this));

      // Set up stats monitoring
      this.statsInterval = setInterval(() => this.logServerStats(), this.STATS_INTERVAL);

      console.log('[Socket] WebSocket server started');
    } catch (error: any) {
      console.error('[Socket] Error starting WebSocket server:', error);
    }
  }

  private handleConnection(socket: Socket): void {
    try {
      const user: User = (socket as any).user;
      if (!user) {
        console.error('[Socket] Connection without user data, rejecting');
        socket.disconnect();
        return;
      }

      // Generate a unique ID for this connection
      const connectionId = `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      console.log(`[Socket] User ${user.name} (${user.id}) connected. Transport: ${socket.conn.transport.name}, Connection ID: ${connectionId}`);

      const socketClient = new SocketClient(user, this.core, this.server!, socket);
      // Store client for monitoring
      this.clients.set(connectionId, socketClient);

      this.core.connect(socketClient);
      socketClient.attachListeners();

      socket.conn.on('upgrade', (transport: Transport) => {
        console.log(`[Socket] Transport upgraded for user ${user.name} (${user.id}): ${transport.name}, Connection ID: ${connectionId}`);
      });

      socket.conn.on('packet', (packet: Packet) => {
        if (packet.type === 'ping') {
          // For performance, only log some pings for monitoring
          if (Math.random() < 0.1) { // Log roughly 10% of pings
            console.log(`[Socket] Heartbeat received from user ${user.name} (${user.id}), Connection ID: ${connectionId}`);
          }
        }
      });

      socket.on('disconnect', (reason) => {
        try {
          console.log(`[Socket] User ${user.name} (${user.id}) disconnected. Reason: ${reason}, Connection ID: ${connectionId}`);
          this.core.disconnect(socketClient);
          user.updateLastSeen();

          // Remove from clients map
          this.clients.delete(connectionId);

          // Explicitly dispose
          socketClient.dispose();
        } catch (error: any) {
          console.error(`[Socket] Error handling disconnect for user ${user.name} (${user.id}):`, error);
        }
      });

      socket.on('error', (error) => {
        console.error(`[Socket] Error for user ${user.name} (${user.id}), Connection ID: ${connectionId}:`, error);
      });

    } catch (error: any) {
      console.error('[Socket] Error handling new connection:', error);
      // Attempt to disconnect the problematic socket
      try {
        socket.disconnect();
      } catch (e) {
        // Ignore errors in disconnect
      }
    }
  }

  private logServerStats(): void {
    try {
      const cpuUsage = this.getCpuUsagePercent();
      const memoryUsage = process.memoryUsage();
      const clientCount = this.clients.size;

      console.log(`[Stats] Connections: ${clientCount}, CPU: ${cpuUsage.toFixed(1)}%, Memory: ${this.formatMemory(memoryUsage.rss)}`);

      // Log details if there are a lot of connections
      if (clientCount > 50) {
        console.log(`[Stats] High connection count: ${clientCount}`);
      }

      // Warning for high CPU usage
      if (cpuUsage > 70) {
        console.warn(`[Stats] High CPU usage: ${cpuUsage.toFixed(1)}%`);
      }

      // Warning for high memory usage
      if (memoryUsage.rss > 1024 * 1024 * 1024) { // >1GB
        console.warn(`[Stats] High memory usage: ${this.formatMemory(memoryUsage.rss)}`);
      }
    } catch (error: any) {
      console.error('[Stats] Error logging server stats:', error);
    }
  }

  private getCpuUsagePercent(): number {
    try {
      // Simple CPU usage calculation based on OS library
      const cpus = os.cpus();
      let totalIdle = 0;
      let totalTick = 0;

      cpus.forEach(cpu => {
        for (const type in cpu.times) {
          totalTick += cpu.times[type as keyof typeof cpu.times];
        }
        totalIdle += cpu.times.idle;
      });

      // Calculate CPU usage as percentage of non-idle time
      return 100 - (totalIdle / totalTick * 100);
    } catch (error) {
      return 0;
    }
  }

  private formatMemory(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  public dispose(): void {
    try {
      console.log('[Socket] Disposing WebSocket server');

      // Clear intervals
      if (this.statsInterval) {
        clearInterval(this.statsInterval);
      }

      if (this.pingInterval) {
        clearInterval(this.pingInterval);
      }

      // Clean up all clients
      for (const client of this.clients.values()) {
        try {
          client.dispose();
        } catch (error) {
          console.error('[Socket] Error disposing client:', error);
        }
      }

      this.clients.clear();

      // Disconnect all sockets
      if (this.server) {
        this.server.disconnectSockets(true);
        this.server.close();
      }
    } catch (error: any) {
      console.error('[Socket] Error disposing WebSocket server:', error);
    }
  }
}