import * as http from 'http';
import { Server, Socket, ServerOptions } from 'socket.io';

import { Core } from '../../game/core/core';
import { SocketClient } from './socket-client';
import { User } from '../../storage';
import { authMiddleware } from './auth-middleware';
import { config } from '../../config';

export type Middleware = (socket: Socket, next: (err?: any) => void) => void;

export class WebSocketServer {
  public server: Server | undefined;

  constructor(private core: Core) { }

  public async listen(httpServer: http.Server): Promise<void> {
    const opts: Partial<ServerOptions> = {
      pingInterval: 25000,    // 25 seconds
      pingTimeout: 20000,     // 20 seconds
      connectTimeout: 45000,  // 45 seconds
      transports: ['websocket', 'polling'],  // Allow fallback to polling if websocket fails
      allowUpgrades: true,
    };

    if (config.backend.allowCors) {
      opts.cors = { origin: '*' };
    }

    const server = new Server(httpServer, opts);

    this.server = server;
    server.use(authMiddleware);

    server.on('connection', (socket: Socket) => {
      const user: User = (socket as any).user;

      const socketClient = new SocketClient(user, this.core, server, socket);
      this.core.connect(socketClient);
      socketClient.attachListeners();

      socket.on('disconnect', (reason: string) => {
        console.log(`[Disconnect] User ${user.name} (${user.id}) disconnected. Reason: ${reason}`);
        this.core.disconnect(socketClient);
        user.updateLastSeen();
      });

      socket.on('error', (error: Error) => {
        console.error(`[Socket Error] User ${user.name} (${user.id}):`, error);
      });

      socket.on('connect_error', (error: Error) => {
        console.error(`[Connect Error] User ${user.name} (${user.id}):`, error);
      });
    });
  }
}