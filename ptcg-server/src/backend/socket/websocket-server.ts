import * as http from 'http';
import { Server, Socket, ServerOptions } from 'socket.io';
import { Core } from '../../game/core/core';
import { SocketClient } from './socket-client';
import { User } from '../../storage';
import { authMiddleware } from './auth-middleware';
import { config } from '../../config';
import { ReconnectionManager } from '../services/reconnection-manager';
import { logger } from '../../utils/logger';

export type Middleware = (socket: Socket, next: (err?: any) => void) => void;

export class WebSocketServer {
  public server: Server | undefined;
  private reconnectionManager: ReconnectionManager;

  constructor(private core: Core) {
    this.reconnectionManager = new ReconnectionManager(config.reconnection);
  }

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

    server.on('connection', async (socket: Socket) => {
      const user: User = (socket as any).user;

      try {
        const socketClient = new SocketClient(user, this.core, server, socket);
        const reconnectionTarget = this.findReconnectionTarget(user.id);
        if ((socket as any).isReconnectionAttempt && reconnectionTarget) {
          socketClient.id = reconnectionTarget.playerId;
        }

        // Simple connection - just connect to core
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







  /**
   * Get the reconnection manager instance
   */
  public getReconnectionManager(): ReconnectionManager {
    return this.reconnectionManager;
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

  /**
   * Dispose of the WebSocketServer and cleanup resources
   */
  public dispose(): void {
    if (this.reconnectionManager) {
      this.reconnectionManager.dispose();
    }
    if (this.server) {
      this.server.close();
    }
  }
}