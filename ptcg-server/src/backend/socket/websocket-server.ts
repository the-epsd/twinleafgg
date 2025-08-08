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
      // Prefer stable websocket transport and avoid long-polling fallbacks
      transports: ['websocket'],
      // Make the server more tolerant to background tab throttling / flaky networks
      pingInterval: 30000,   // default 25000
      pingTimeout: 120000    // default 20000 → allow up to 2 minutes without pong
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

      socket.on('disconnect', (reason) => {
        try {
          console.log(`[Socket] Disconnected user=${user?.id ?? 'unknown'} reason=${String(reason)}`);
        } catch { /* noop */ }
        this.core.disconnect(socketClient);
        socketClient.dispose();
        user.updateLastSeen();
      });
    });
  }
}