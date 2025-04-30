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
      pingInterval: 30000,    // Check connection every 30s
      pingTimeout: 86400000,  // Set to 24 hours to effectively disable inactivity timeout
      connectTimeout: 30000,  // Standard 30s connection timeout
      transports: ['websocket'],
      allowUpgrades: true,
      upgradeTimeout: 30000,   // Standard 30s upgrade timeout
      perMessageDeflate: true,
      httpCompression: true,
      allowEIO3: true,
      maxHttpBufferSize: 1e8,
      cors: config.backend.allowCors ? { origin: '*' } : undefined
    };

    try {
      const server = new Server(httpServer, opts);
      this.server = server;
      server.use(authMiddleware);

      // Add error handling
      server.on('error', (error: Error) => {
        console.error('[Socket] Server error:', error);
      });

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
        console.error('[Socket] Connection rejected: Missing user data');
        socket.disconnect();
        return;
      }

      // Generate a unique ID for this connection
      const connectionId = `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      console.log(`[Socket] New connection: User ${user.name} (${user.id}) [${connectionId}]`);

      const socketClient = new SocketClient(user, this.core, this.server!, socket);
      this.clients.set(connectionId, socketClient);

      this.core.connect(socketClient);
      socketClient.attachListeners();

      socket.conn.on('upgrade', (transport: Transport) => {
        console.log(`[Socket] Transport upgrade: ${user.name} [${connectionId}] -> ${transport.name}`);
      });

      socket.conn.on('packet', (packet: Packet) => {
        if (packet.type === 'ping') {
          // Only log pings if they're delayed or if we're debugging
          const now = Date.now();
          const lastPing = (socket as any).lastPing || now;
          if (now - lastPing > 30000) { // Log if ping interval is > 30s
            console.log(`[Socket] Delayed heartbeat: ${user.name} [${connectionId}] (${now - lastPing}ms)`);
          }
          (socket as any).lastPing = now;
        }
      });

      socket.on('disconnect', (reason) => {
        try {
          console.log(`[Socket] Disconnect: ${user.name} [${connectionId}] - ${reason}`);
          user.updateLastSeen();
          this.clients.delete(connectionId);
          socketClient.dispose();
        }
        catch (error: any) {
          console.error(`[Socket] Error during disconnect: ${user.name} [${connectionId}] - ${error.message}`);
        }
      });

      socket.on('error', (error) => {
        console.error(`[Socket] Error: ${user.name} [${connectionId}] - ${error.message}`);
      });

    } catch (error: any) {
      console.error('[Socket] Connection error:', error.message);
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

      // Only log stats if there are significant changes or issues
      const lastStats = (this as any).lastStats || { clientCount: 0, cpuUsage: 0, memoryUsage: 0 };
      const hasSignificantChange =
        Math.abs(clientCount - lastStats.clientCount) > 5 ||
        Math.abs(cpuUsage - lastStats.cpuUsage) > 10 ||
        Math.abs(memoryUsage.rss - lastStats.memoryUsage) > 100 * 1024 * 1024; // 100MB change

      if (hasSignificantChange) {
        console.log(`[Stats] Connections: ${clientCount} (${clientCount - lastStats.clientCount > 0 ? '+' : ''}${clientCount - lastStats.clientCount}), CPU: ${cpuUsage.toFixed(1)}%, Memory: ${this.formatMemory(memoryUsage.rss)}`);

        // Store current stats for next comparison
        (this as any).lastStats = { clientCount, cpuUsage, memoryUsage: memoryUsage.rss };
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
      console.error('[Stats] Error logging server stats:', error.message);
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