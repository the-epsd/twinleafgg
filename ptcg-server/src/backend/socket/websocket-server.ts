import * as http from 'http';
import { Server, Socket, ServerOptions } from 'socket.io';
import { Core } from '../../game/core/core';
import { SocketClient } from './socket-client';
import { User } from '../../storage';
import { authMiddleware } from './auth-middleware';
import { config } from '../../config';
import { logger } from '../../utils/logger';

export type Middleware = (socket: Socket, next: (err?: any) => void) => void;

export class WebSocketServer {
  public server: Server | undefined;

  constructor(private core: Core) {
  }

  public async listen(httpServer: http.Server): Promise<void> {
    const opts: Partial<ServerOptions> = {
      transports: ['websocket'],
      pingInterval: 30000,   // default 25000
      pingTimeout: 120000    // default 20000 → allow up to 2 minutes without pong
    };

    if (config.backend.allowCors) {
      opts.cors = { origin: '*' };
    }

    const server = new Server(httpServer, opts);

    this.server = server;
    server.use(authMiddleware);

    server.on('connection', async (socket: Socket) => {
      const user: User = (socket as any).user;

      try {
        const socketClient = new SocketClient(user, this.core, server, socket);
        const reconnectionTarget = this.findReconnectionTarget(user.id);
        if (reconnectionTarget) {
          socketClient.id = reconnectionTarget.playerId;
        }

        await this.core.connect(socketClient);
        socketClient.attachListeners();

        socket.on('disconnect', async (reason) => {
          try {
            try {
              await this.core.getReconnectionManager().handleDisconnection(socketClient, String(reason));
            } catch (error) {
              logger.log(`[Socket] Error preserving disconnection state: ${error}`);
            }
            // Simple disconnection - just disconnect from core
            await this.core.disconnect(socketClient, String(reason));
            socketClient.dispose();
            user.updateLastSeen();
          } catch (error) {
            logger.log(`[Socket] Error handling disconnection: ${error}`);
          }
        });

      } catch (error) {
        logger.log(`[Socket] Error during connection setup: ${error}`);
        socket.disconnect(true);
      }
    });
  }

  public getReconnectionManager() {
    return this.core.getReconnectionManager();
  }

  private findReconnectionTarget(userId: number): { gameId: number; playerId: number } | undefined {
    for (const game of this.core.games) {
      const playerId = game.getPlayerIdForUser(userId);
      if (playerId && game.isPlayerDisconnected(playerId)) {
        return { gameId: game.id, playerId };
      }
    }
    return undefined;
  }

  public dispose(): void {
    if (this.server) {
      this.server.close();
    }
  }
}