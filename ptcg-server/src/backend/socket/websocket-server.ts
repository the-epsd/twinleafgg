import * as http from 'http';
import { Server, Socket, ServerOptions } from 'socket.io';

import { Core } from '../../game/core/core';
import { SocketClient } from './socket-client';
import { User } from '../../storage';
import { authMiddleware } from './auth-middleware';
import { config } from '../../config';
import { Transport } from 'nodemailer';

export type Middleware = (socket: Socket, next: (err?: any) => void) => void;

export class WebSocketServer {
  public server: Server | undefined;

  constructor(private core: Core) { }

  public async listen(httpServer: http.Server): Promise<void> {
    const opts: Partial<ServerOptions> = {
      pingInterval: 45000,   // Increased to 45s to reduce unnecessary pings
      pingTimeout: 300000,   // 5 minutes (300s)
      connectTimeout: 10000,   // 10 seconds
      transports: ['websocket', 'polling'],
      allowUpgrades: true,
      maxHttpBufferSize: 1e8,  // 100 MB
    };

    if (config.backend.allowCors) {
      opts.cors = { origin: '*' };
    }

    const server = new Server(httpServer, opts);
    this.server = server;
    server.use(authMiddleware);

    server.on('connection', (socket: Socket) => {
      const user: User = (socket as any).user;
      let lastActivity = Date.now();
      let isInGame = false;

      // Log initial connection
      console.log(`[Connect] User ${user.name} (${user.id}) | ` +
        `Client: ${socket.handshake.headers['user-agent']?.split(' ').pop() || 'unknown'}`);

      // Track activity and game state
      socket.onAny((eventName: string) => {
        lastActivity = Date.now();
        if (eventName.startsWith('game:')) {
          isInGame = true;
        }
      });

      // Monitor disconnects with enhanced context
      socket.on('disconnect', (reason: string) => {
        const timeSinceLastActivity = Date.now() - lastActivity;
        const disconnectContext = {
          reason,
          inGame: isInGame,
          timeSinceLastActivity: Math.floor(timeSinceLastActivity / 1000),
          wasActive: timeSinceLastActivity < 5000, // Consider "active" if action within last 5 seconds
          hadVisibilityEvent: socket.handshake.query.lastVisibilityState === 'hidden'
        };

        // Categorize the disconnect
        let disconnectType = 'Unknown';
        if (reason === 'transport close') {
          if (!isInGame && timeSinceLastActivity > 30000) {
            disconnectType = 'Likely Tab Close (Inactive)';
          } else if (isInGame && !disconnectContext.wasActive) {
            disconnectType = 'Possible Tab Close (In Game)';
          } else if (disconnectContext.wasActive) {
            disconnectType = 'Unexpected Transport Close (Was Active)';
          }
        } else if (reason === 'ping timeout') {
          disconnectType = 'Connection Issue (Ping Timeout)';
        } else if (reason === 'client namespace disconnect') {
          disconnectType = 'Client Initiated Disconnect';
        }

        // Log the enhanced disconnect info
        console.log(
          `[Disconnect] User ${user.name} (${user.id}) | ` +
          `Type: ${disconnectType} | ` +
          `Last Activity: ${disconnectContext.timeSinceLastActivity}s ago | ` +
          `In Game: ${disconnectContext.inGame} | ` +
          `Was Active: ${disconnectContext.wasActive}`
        );

        // If it was an unexpected disconnect during gameplay, log additional context
        if (isInGame && disconnectContext.wasActive && reason === 'transport close') {
          console.log(
            `[Unexpected Game Disconnect] User ${user.name} (${user.id}) | ` +
            `Last Activity: ${new Date(lastActivity).toISOString()} | ` +
            `Session Duration: ${Math.floor((Date.now() - socket.handshake.issued) / 1000)}s`
          );
        }

        this.core.disconnect(socketClient);
        user.updateLastSeen();
      });

      // Track visibility events from client
      socket.on('visibility', (state: 'visible' | 'hidden') => {
        console.log(`[Visibility] User ${user.name} (${user.id}) tab became ${state}`);
        socket.handshake.query.lastVisibilityState = state;
      });

      // Monitor transport changes
      socket.conn.on('upgrade', (transport: Transport) => {
        console.log(`[Transport] User ${user.name} (${user.id}) upgraded to ${transport.name}`);
      });

      // Monitor packet events
      socket.conn.on('packet', (packet: { type: string }) => {
        if (packet.type === 'ping' || packet.type === 'pong') return; // Skip logging heartbeats
        console.log(`[Packet] User ${user.name} (${user.id}) ${packet.type}`);
      });

      // Monitor close events with more detail
      socket.conn.on('close', (reason: string) => {
        console.log(`[Transport Close] User ${user.name} (${user.id}) | ` +
          `Reason: ${reason} | ` +
          `Last Transport: ${socket.conn.transport.name} | ` +
          `Connected Duration: ${(Date.now() - socket.handshake.issued) / 1000}s`);
      });

      // Monitor errors
      socket.on('error', (error: Error) => {
        console.error(`[Socket Error] User ${user.name} (${user.id}):`, error);
      });

      socket.conn.on('error', (error: Error) => {
        console.error(`[Transport Error] User ${user.name} (${user.id}):`, error);
      });

      // Monitor ping/pong
      let lastPing = Date.now();
      socket.conn.on('ping', () => {
        lastPing = Date.now();
        console.log(`[Ping] User ${user.name} (${user.id})`);
      });

      socket.conn.on('pong', () => {
        const latency = Date.now() - lastPing;
        if (latency > 1000) { // Log high latency
          console.log(`[High Latency] User ${user.name} (${user.id}) - ${latency}ms`);
        }
      });

      // WebSocket specific monitoring
      if (socket.conn.transport.name === 'websocket') {
        const ws = (socket.conn.transport as any).ws;
        if (ws) {
          ws.on('unexpected-response', (req: any, res: any) => {
            console.error(`[WebSocket Error] User ${user.name} (${user.id}) unexpected response:`,
              res.statusCode, res.statusMessage);
          });
        }
      }

      // Create and connect the socket client
      const socketClient = new SocketClient(user, this.core, server, socket);
      this.core.connect(socketClient);
      socketClient.attachListeners();
    });
  }
}